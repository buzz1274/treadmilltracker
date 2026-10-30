from unittest.mock import Mock

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.exc import NoResultFound

from app.api.runs.enums import Interval, PersonalBestType
from app.api.runs.models import PersonalBestPublic, RunPublic
from app.api.runs.repository import RunsRepository
from app.core.authentication import get_current_user
from app.main import app


@pytest.fixture
def repository():
    return Mock(spec=RunsRepository)


@pytest.fixture
def client(repository):
    previous_overrides = app.dependency_overrides.copy()
    app.dependency_overrides[RunsRepository] = lambda: repository
    app.dependency_overrides[get_current_user] = lambda: Mock(id=42)
    # These route tests isolate persistence and avoid starting a real database.
    client = TestClient(app, raise_server_exceptions=False)
    try:
        yield client
    finally:
        client.close()
        app.dependency_overrides.clear()
        app.dependency_overrides.update(previous_overrides)


@pytest.fixture
def run_payload():
    return {
        "distance_m": 5000,
        "duration_s": 1800,
        "calories": 350,
        "vo2max": 45,
        "run_date": "2026-10-20",
    }


def assert_response(response, status_code, snapshot):
    assert response.status_code == status_code
    assert {
        "status_code": response.status_code,
        "content_type": response.headers.get("content-type"),
        "body": (
            response.json()
            if response.content
            and response.headers.get("content-type") == "application/json"
            else response.text
        ),
    } == snapshot


@pytest.mark.parametrize("group_by", list(Interval))
def test_get_runs_with_filters(
    client, repository, run_payload, group_by, snapshot
):
    repository.get_runs.return_value = [RunPublic(id=7, **run_payload)]

    response = client.get(
        "/api/runs/",
        params={
            "start_date": "2026-10-01",
            "end_date": "2026-10-31",
            "group_by": group_by.value,
        },
    )

    assert_response(response, 200, snapshot)
    repository.get_runs.assert_called_once_with(
        42, "2026-10-01", "2026-10-31", group_by
    )


def test_get_runs_uses_default_filters(
    client, repository, run_payload, snapshot
):
    repository.get_runs.return_value = [RunPublic(id=7, **run_payload)]
    response = client.get("/api/runs/")
    assert_response(response, 200, snapshot)
    repository.get_runs.assert_called_once_with(42, None, None, Interval.days)


def test_get_runs_empty_result(client, repository, snapshot):
    repository.get_runs.return_value = []
    assert_response(client.get("/api/runs/"), 200, snapshot)


def test_get_personal_bests(client, repository, run_payload, snapshot):
    repository.personal_bests.return_value = [
        PersonalBestPublic(
            id=3,
            title="Fastest 5km",
            sort_order=1,
            type=PersonalBestType.SPEED,
            min_distance_m=5000,
            max_distance_m=5005,
            runs=[RunPublic(id=7, **run_payload)],
        ),
        PersonalBestPublic(
            id=4,
            title="Longest run",
            sort_order=2,
            type=PersonalBestType.DISTANCE,
            runs=[],
        ),
    ]
    assert_response(client.get("/api/runs/personal_bests"), 200, snapshot)
    repository.personal_bests.assert_called_once_with(42)


def test_get_personal_bests_empty_result(client, repository, snapshot):
    repository.personal_bests.return_value = []
    assert_response(client.get("/api/runs/personal_bests"), 200, snapshot)


@pytest.mark.parametrize(
    "method,repository_method,status_code",
    [
        ("post", "add_run", 201),
        ("patch", "update_run", 200),
    ],
)
def test_save_run(
    client,
    repository,
    run_payload,
    method,
    repository_method,
    status_code,
    snapshot,
):
    if method == "patch":
        run_payload["id"] = 7
    response = client.request(method, "/api/runs/", json=run_payload)
    assert_response(response, status_code, snapshot)
    getattr(repository, repository_method).assert_called_once()
    user_id, run = getattr(repository, repository_method).call_args.args
    assert user_id == 42
    assert isinstance(run, RunPublic)
    assert run.model_dump(exclude={"pace"}, exclude_none=True) == {
        **run_payload,
        "vo2max": 45,
    }


def test_delete_run(client, repository, snapshot):
    assert_response(client.delete("/api/runs/7"), 204, snapshot)
    repository.delete_run.assert_called_once_with(42, 7)


@pytest.mark.parametrize(
    "method,path,repository_method,error,status_code",
    [
        ("get", "/api/runs/", "get_runs", NoResultFound(), 404),
        (
            "get",
            "/api/runs/",
            "get_runs",
            RuntimeError("Database unavailable"),
            500,
        ),
        (
            "get",
            "/api/runs/personal_bests",
            "personal_bests",
            NoResultFound(),
            404,
        ),
        (
            "get",
            "/api/runs/personal_bests",
            "personal_bests",
            RuntimeError("Database unavailable"),
            500,
        ),
        (
            "post",
            "/api/runs/",
            "add_run",
            RuntimeError("Database unavailable"),
            500,
        ),
        ("patch", "/api/runs/", "update_run", NoResultFound(), 404),
        (
            "patch",
            "/api/runs/",
            "update_run",
            RuntimeError("Database unavailable"),
            500,
        ),
        ("delete", "/api/runs/7", "delete_run", NoResultFound(), 404),
        (
            "delete",
            "/api/runs/7",
            "delete_run",
            ValueError("Run not found"),
            404,
        ),
        (
            "delete",
            "/api/runs/7",
            "delete_run",
            RuntimeError("Database unavailable"),
            500,
        ),
    ],
    ids=[
        "list-missing",
        "list-error",
        "bests-missing",
        "bests-error",
        "create-error",
        "update-missing",
        "update-error",
        "delete-missing",
        "delete-value-error",
        "delete-error",
    ],
)
def test_repository_errors(
    client,
    repository,
    run_payload,
    method,
    path,
    repository_method,
    error,
    status_code,
    snapshot,
):
    getattr(repository, repository_method).side_effect = error
    kwargs = (
        {"json": {**run_payload, "id": 7}}
        if method in ("post", "patch")
        else {}
    )
    assert_response(
        client.request(method, path, **kwargs), status_code, snapshot
    )
    getattr(repository, repository_method).assert_called_once()


@pytest.mark.parametrize("method", ["post", "patch"])
@pytest.mark.parametrize(
    "invalid_payload",
    [
        {},
        {"distance_m": "invalid"},
        {"duration_s": None},
        {"vo2max": "invalid"},
        {"calories": "invalid"},
    ],
    ids=[
        "missing-fields",
        "invalid-distance",
        "null-duration",
        "invalid-vo2max",
        "invalid-calories",
    ],
)
def test_invalid_run_payload(
    client, repository, run_payload, method, invalid_payload, snapshot
):
    payload = {**run_payload, **invalid_payload} if invalid_payload else {}
    assert_response(
        client.request(method, "/api/runs/", json=payload), 422, snapshot
    )
    assert repository.mock_calls == []


@pytest.mark.parametrize("method", ["post", "patch"])
def test_missing_request_body(client, repository, method, snapshot):
    assert_response(client.request(method, "/api/runs/"), 422, snapshot)
    assert repository.mock_calls == []


def test_invalid_group_by(client, repository, snapshot):
    assert_response(
        client.get("/api/runs/", params={"group_by": "hours"}), 422, snapshot
    )
    assert repository.mock_calls == []


def test_invalid_run_id(client, repository, snapshot):
    assert_response(client.delete("/api/runs/not-an-integer"), 422, snapshot)
    assert repository.mock_calls == []


@pytest.mark.parametrize(
    "method,path",
    [
        ("get", "/api/runs/"),
        ("get", "/api/runs/personal_bests"),
        ("post", "/api/runs/"),
        ("patch", "/api/runs/"),
        ("delete", "/api/runs/7"),
    ],
)
def test_authentication_required(
    client, repository, run_payload, method, path, snapshot
):
    del app.dependency_overrides[get_current_user]
    kwargs = {"json": run_payload} if method in ("post", "patch") else {}
    response = client.request(method, path, **kwargs)
    assert_response(response, 401, snapshot)
    assert repository.mock_calls == []
