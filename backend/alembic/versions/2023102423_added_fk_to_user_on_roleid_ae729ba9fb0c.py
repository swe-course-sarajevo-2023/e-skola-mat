"""Added fk to user on roleid

Revision ID: ae729ba9fb0c
Revises: 8ec35d767973
Create Date: 2023-10-24 01:23:17.557386

"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "ae729ba9fb0c"
down_revision = "8ec35d767973"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "user_model", sa.Column("role_id", sa.UUID(as_uuid=False), nullable=True)
    )
    op.create_foreign_key(None, "user_model", "roles", ["role_id"], ["id"])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "user_model", type_="foreignkey")
    op.drop_column("user_model", "role_id")
    # ### end Alembic commands ###
