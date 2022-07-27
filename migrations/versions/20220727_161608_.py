"""empty message

Revision ID: bf5d9270539a
Revises: 6435fc63c22d
Create Date: 2022-07-27 16:16:08.787799

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bf5d9270539a'
down_revision = '6435fc63c22d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('friends', sa.Column('accepted', sa.Boolean(), nullable=True))
    op.drop_column('friends', 'request')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('friends', sa.Column('request', sa.BOOLEAN(), autoincrement=False, nullable=True))
    op.drop_column('friends', 'accepted')
    # ### end Alembic commands ###
