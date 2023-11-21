import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "3bca7bf44a33"
down_revision = "b06472cc30ad"
branch_labels = None
depends_on = None


def upgrade():
    # Create the enum type
    homeworkstatus = sa.Enum(
        "NOT_STARTED", "IN_PROGRESS", "FINISHED", name="homeworkstatus"
    )
    homeworkstatus.create(op.get_bind(), checkfirst=True)

    # Add the column
    op.add_column(
        "homework",
        sa.Column(
            "status",
            homeworkstatus,
            nullable=True,
        ),
    )


def downgrade():
    # Drop the column
    op.drop_column("homework", "status")

    # Drop the enum type
    sa.Enum(name="homeworkstatus").drop(op.get_bind(), checkfirst=True)
