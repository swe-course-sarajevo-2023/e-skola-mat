"""Added class model

Revision ID: 51d799fce9a0
Revises: b7ecfda0b50c
Create Date: 2023-10-24 23:44:28.598414

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "51d799fce9a0"
down_revision = "b7ecfda0b50c"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "class",
        sa.Column("id", sa.UUID(as_uuid=False), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("class")
    # ### end Alembic commands ###
