from importlib import import_module

import pytest
from alembic.migration import MigrationContext
from alembic.operations import Operations
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import IntegrityError

migration = import_module(
    "app.alembic.versions.7c2a6e91b4d8_enforce_run_metric_constraints"
)


@pytest.fixture
def migrated_connection():
    engine = create_engine("sqlite://")
    with engine.connect() as connection:
        # Reproduce the schema supplied by earlier migrations, rather than
        # create_all(), which would hide missing migration constraints.
        connection.execute(
            text(
                """
            CREATE TABLE run (
                id INTEGER PRIMARY KEY,
                calories INTEGER,
                vo2max INTEGER,
                avg_heart_rate INTEGER,
                max_heart_rate INTEGER,
                weight_kg NUMERIC(5, 2)
            )
        """
            )
        )
        connection.execute(text("INSERT INTO run (id) VALUES (1)"))
        with Operations.context(MigrationContext.configure(connection)):
            migration.upgrade()
        connection.commit()
        yield connection
    engine.dispose()


@pytest.mark.parametrize(
    "field",
    ["calories", "vo2max", "avg_heart_rate", "max_heart_rate", "weight_kg"],
)
@pytest.mark.parametrize("value", [0, -1])
def test_migration_rejects_non_positive_metrics(
    migrated_connection, field, value
):
    with pytest.raises(IntegrityError, match=f"{field}_positive"):
        with migrated_connection.begin_nested():
            migrated_connection.execute(
                text(f"UPDATE run SET {field} = :value WHERE id = 1"),
                {"value": value},
            )


def test_migration_rejects_reversed_heart_rates(migrated_connection):
    with pytest.raises(IntegrityError, match="heart_rate_range_valid"):
        with migrated_connection.begin_nested():
            migrated_connection.execute(
                text(
                    "UPDATE run SET avg_heart_rate = 180, max_heart_rate = 140"
                )
            )


def test_migration_preserves_nulls_and_allows_valid_metrics(
    migrated_connection,
):
    row = (
        migrated_connection.execute(text("SELECT * FROM run")).mappings().one()
    )
    assert all(value is None for field, value in row.items() if field != "id")
    migrated_connection.execute(
        text(
            """
        UPDATE run SET calories = 350, vo2max = 45,
            avg_heart_rate = 140, max_heart_rate = 140, weight_kg = 75.5
    """
        )
    )
    row = (
        migrated_connection.execute(text("SELECT * FROM run")).mappings().one()
    )
    assert row["weight_kg"] == 75.5
    assert row["avg_heart_rate"] == row["max_heart_rate"] == 140
    migrated_connection.execute(
        text(
            """
        UPDATE run SET calories = NULL, vo2max = NULL,
            avg_heart_rate = NULL, max_heart_rate = NULL, weight_kg = NULL
    """
        )
    )


def test_migration_can_be_rolled_back(migrated_connection):
    with Operations.context(MigrationContext.configure(migrated_connection)):
        migration.downgrade()
    assert inspect(migrated_connection).get_check_constraints("run") == []
    migrated_connection.execute(text("UPDATE run SET weight_kg = -1"))
