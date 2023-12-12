"""Added user-homework_task model

Revision ID: b90c4caaadf6
Revises: 2632e642dca3
Create Date: 2023-10-25 00:03:46.700278

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "b90c4caaadf6"
down_revision = "2632e642dca3"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "task-user-homework",
        sa.Column("id", sa.UUID(as_uuid=False), nullable=False),
        sa.Column("user_id", sa.UUID(as_uuid=False), nullable=True),
        sa.Column("homework_id", sa.UUID(as_uuid=False), nullable=True),
        sa.Column("order_number_of_the_task", sa.Integer(), nullable=True),
        sa.Column("commentProfessor", sa.String(length=255), nullable=True),
        sa.Column("commentStudent", sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(
            ["homework_id"],
            ["homework.id"],
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
    op.drop_table("task-user-homework")
    # ### end Alembic commands ###