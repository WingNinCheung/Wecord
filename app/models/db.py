from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import Column, ForeignKey, Table
from sqlalchemy.types import Integer, String, Boolean, Text
from sqlalchemy.orm import declarative_base, relationship
from .user import User

db = SQLAlchemy()

server_users = Table(
    "server_users",
    db.Model.metadata,
    Column("id", Integer, primary_key=True),
    Column("userId", Integer, ForeignKey("users.id"), primary_key=True),
    Column("serverId", Integer, ForeignKey("servers.id"), primary_key=True),
    Column("adminStatus", Boolean),
    Column("muted", Boolean)
)

class Server(db.Model):
    __tablename__ = 'servers'

    id = Column(Integer, primary_key=True)
    master_admin = Column(Integer)
    name = Column(String(50))
    private = Column(Boolean)
    picture = Column(Text)

    # relationships
    channels = relationship("Channel", back_populates="server", cascade="all, delete")
    master_admin = relationship("User", back_populates="servers")
    user = db.relationship("User",
        secondary="server_users",
        back_populates="server",
        cascade="all, delete"
    )

class Channel(db.Model):
    __tablename__ = 'channels'

    id = Column(Integer, primary_key=True)
    serverId = Column(Integer, ForeignKey("servers.id"))
    title = Column(String(30))

    # relationships
    server = relationship("Server", back_populates="channels", cascade="all, delete")
    messages = relationship("Message", back_populates="channel", cascade="all, delete")

class Message(db.Model):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey("users.id"))
    channelId = Column(Integer, ForeignKey("channels.id"))
    message = Column(String(1500))

    # relationships
    user = relationship("User", back_populates="messages")
    channel = relationship("Channel", back_populates="messages")
