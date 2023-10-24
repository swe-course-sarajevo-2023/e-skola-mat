"""Added fk to user on roles

Revision ID: 8ec35d767973
Revises: b42c93be23ba
Create Date: 2023-10-24 00:09:20.319054

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "8ec35d767973"
down_revision = "b42c93be23ba"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("user_model", sa.Column("name", sa.String(length=100), nullable=True))
    op.add_column(
        "user_model", sa.Column("surname", sa.String(length=100), nullable=True)
    )
    op.add_column(
        "user_model", sa.Column("username", sa.String(length=100), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("user_model", "username")
    op.drop_column("user_model", "surname")
    op.drop_column("user_model", "name")
    # ### end Alembic commands ###
