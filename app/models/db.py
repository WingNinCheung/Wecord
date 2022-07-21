from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy.types import Integer, String, Date, Boolean, Text
from sqlalchemy.orm import declarative_base, relationship
from .user import User

db = SQLAlchemy()

class Server(db.Model):
    __tablename__ = 'servers'

    id = Column(Integer, primary_key=True)
    master_admin = Column(Integer)
    name = Column(String(50))
    private = Column(Boolean)
    picture = Column(Text)

    channels = relationship("Channel", back_populates="server", cascade="all, delete")
    master_admin = relationship("User", back_populates="servers")

class Channel(db.Model):
    __tablename__ = 'channels'

    id = Column(Integer, primary_key=True)
    serverId = Column(Integer, ForeignKey(Server.id))
    name = Column(String())

    server = relationship("Server", back_populates="channels", cascade="all, delete")
    messages = relationship("Message", back_populates="channel", cascade="all, delete")

class Message(db.Model):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey(User.id))
    channelId = Column(Integer, ForeignKey(Channel.id))
    message = Column(String(1500))

    # Relationships here
    user = relationship("User", back_populates="messages")
    channel = relationship("Channel", back_populates="messages")

# class serverUsers(db.Model):
#     __tablename__ = "server_users"

#     id = Column(Integer, primary_key=True)
#     serverId = Column(Integer, ForeignKey(Server.id))
#     userId = Column(Integer, Foreign)
