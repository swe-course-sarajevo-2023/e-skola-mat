"""Added class-homework model

Revision ID: 57638db5330c
Revises: 51d799fce9a0
Create Date: 2023-10-24 23:51:56.241755

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "57638db5330c"
down_revision = "51d799fce9a0"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "classHomework",
        sa.Column("id", sa.UUID(as_uuid=False), nullable=False),
        sa.Column("class_id", sa.UUID(as_uuid=False), nullable=True),
        sa.Column("homework_id", sa.UUID(as_uuid=False), nullable=True),
        sa.ForeignKeyConstraint(
            ["class_id"],
            ["class.id"],
        ),
        sa.ForeignKeyConstraint(
            ["homework_id"],
            ["homework.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("classHomework")
    # ### end Alembic commands ###