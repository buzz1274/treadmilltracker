"""Enforce positive run metrics and consistent heart rates.

Revision ID: 7c2a6e91b4d8
Revises: 5a74f5158e21
"""

from alembic import op

revision = "7c2a6e91b4d8"
down_revision = "5a74f5158e21"
branch_labels = None
depends_on = None


CONSTRAINTS = (
    ("calories_positive", "calories > 0"),
    ("vo2max_positive", "vo2max > 0"),
    ("avg_heart_rate_positive", "avg_heart_rate > 0"),
    ("max_heart_rate_positive", "max_heart_rate > 0"),
    ("weight_kg_positive", "weight_kg > 0"),
    ("heart_rate_range_valid", "avg_heart_rate <= max_heart_rate"),
)


def upgrade() -> None:
    # NULL metrics remain valid for runs where values were not recorded.
    with op.batch_alter_table("run") as batch_op:
        for name, condition in CONSTRAINTS:
            batch_op.create_check_constraint(name, condition)


def downgrade() -> None:
    with op.batch_alter_table("run") as batch_op:
        for name, _ in reversed(CONSTRAINTS):
            batch_op.drop_constraint(name, type_="check")
