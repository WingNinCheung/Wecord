from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import Column, ForeignKey, Table
from sqlalchemy.types import Integer, String, Boolean
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class Friend(db.Model):
    __tablename__ = "friends"
    id = db.Column(db.Integer, primary_key=True)
    userId = Column(Integer, nullable=False)
    friendId = Column(Integer, db.ForeignKey("users.id"), nullable=False)
    accepted = Column(Boolean, default=False)

    user = relationship("User", back_populates="friends")

    def to_dict(self):
        return{
            "id": self.id,
            "userId": self.userId,
            "friendId": self.friendId,
            "accepted": self.accepted,
        }


class Server_User(db.Model):
    __tablename__ = "serverusers"
    id = db.Column(db.Integer, primary_key=True)
    serverId = Column(Integer, db.ForeignKey("servers.id"), nullable=False)
    userId = Column(Integer, db.ForeignKey("users.id"), nullable=False)
    adminStatus = Column(Boolean, default=False)
    muted = Column(Boolean, default=False)

    server = relationship("Server", back_populates="users")
    user = relationship("User", back_populates="server")

    def to_dict(self):
        return {
            "id": self.id,
            "serverId": self.serverId,
            "userId": self.userId,
            "adminStatus": self.adminStatus,
            "muted": self.muted,
        }


class Server(db.Model):
    __tablename__ = "servers"

    id = db.Column(db.Integer, primary_key=True)
    master_admin = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    private = db.Column(db.Boolean, nullable=False)
    picture = db.Column(db.Text)

    # relationships
    users = relationship("Server_User", back_populates="server", cascade="all, delete")
    channels = relationship("Channel", back_populates="server", cascade="all, delete")
    masterAdmin = relationship("User", back_populates="servers")

    def to_dict(self):
        return {
            "id": self.id,
            "master_admin": self.master_admin,
            "name": self.name,
            "private": self.private,
            "picture": self.picture,
            "channels": [channel.to_dict() for channel in self.channels]
        }


class Channel(db.Model):
    __tablename__ = "channels"

    id = Column(Integer, primary_key=True)
    serverId = Column(Integer, ForeignKey("servers.id"), nullable=False)
    title = Column(String(30), nullable=False)

    # relationships
    server = relationship("Server", back_populates="channels")
    messages = relationship("Message", back_populates="channel", cascade="all, delete")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "serverId": self.serverId,
            "messages": [message.to_dict() for message in self.messages],
        }


class Message(db.Model):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey("users.id"), nullable=False)
    channelId = Column(Integer, ForeignKey("channels.id"), nullable=False)
    message = Column(String(1500), nullable=False)

    # relationships
    user = relationship("User", back_populates="messages")
    channel = relationship("Channel", back_populates="messages")

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "channelId": self.channelId,
            "message": self.message,
        }
