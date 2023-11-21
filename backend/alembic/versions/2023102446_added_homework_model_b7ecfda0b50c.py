"""Added homework model

Revision ID: b7ecfda0b50c
Revises: 466a1336765f
Create Date: 2023-10-24 01:46:47.345224

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "b7ecfda0b50c"
down_revision = "466a1336765f"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "homework",
        sa.Column("id", sa.UUID(as_uuid=False), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=True),
        sa.Column("dateOfCreation", sa.TIMESTAMP(), nullable=True),
        sa.Column("deadline", sa.TIMESTAMP(), nullable=True),
        sa.Column("maxNumbersOfTasks", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("homework")
    # ### end Alembic commands ###
