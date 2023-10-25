"""Added user-class model

Revision ID: 9457d39aebbe
Revises: 83e01dc595a9
Create Date: 2023-10-25 00:19:15.523732

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9457d39aebbe"
down_revision = "83e01dc595a9"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "user-class",
        sa.Column("id", sa.UUID(as_uuid=False), nullable=False),
        sa.Column("class_id", sa.UUID(as_uuid=False), nullable=True),
        sa.Column("user_id", sa.UUID(as_uuid=False), nullable=True),
        sa.ForeignKeyConstraint(
            ["class_id"],
            ["class.id"],
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["user_model.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("user-class")
    # ### end Alembic commands ###
