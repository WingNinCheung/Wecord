from flask_socketio import SocketIO, join_room, leave_room
from flask import request
import os
from .models.db import db, Message

# set CORS for security
if os.environ.get("FLASK_ENV") == "production":
    origins = [
    "http://wecord.herokuapp.com/",
    "https://wecord.herokuapp.com/"
]
else:
    origins = "*"


# create SocketIO instance
# The logger argument controls logging related to the Socket.IO protocol
# engineio_logger controls logs that originate in the low-level Engine.IO transport
socketio = SocketIO(cors_allowed_origins=origins, logger=True, engineio_logger=True)

# do stuff on connect - I wanna load our messages
@socketio.on("connect")
def test_connect():
    s = request.sid
    socketio.emit("-------WE HAVE CONNECTED!-------", s)

# see when we disconnect
@socketio.on("disconnect")
def test_disconnect():
    socketio.emit("----WE HAVE DISCONNECTED!!!-------")

# connect to chat
@socketio.on("chat")
def handle_chat(data):
    # broadcast=True means that all users connected to this chat will see the message

    # here we can add the message to the database
    message = Message(
        userId=data["userId"],
        channelId=data["channelId"],
        message=data["message"]
    )

    db.session.add(message)
    db.session.commit()

    socketio.emit("chat", data, broadcast=True)

# join a chatroom
@socketio.on("join")
def on_join(data):
    username = data['username']
    room = data['channelId']
    join_room(room)
    # to=room means that only someone connected to this room can see what's happening here
    socketio.send(username + "has entered the room", to=room)

# test to see if we can have a connection event
# @socketio.on('connect')
# def test_connect(auth):
#     socketio.emit('my response', {'data': 'Connected'})

# leave a chatroom
@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['channelId']
    leave_room(room)
    socketio.send(username + "has left the channel.", to=room)

#         // test emitting to that test room when chatting
#         // io.to() <- add a room to an array, io._rooms
#         socketio.to(channelName).emit("chat");

#All clients are assigned a room when they connect, named with the session ID of the connection,
# which can be obtained from request.sid.

#Unlike with a Flask route handler, we will not need to have an actual return statement-
#we send messages explicitly using emit or send functions.

#https://flask-socketio.readthedocs.io/en/latest/getting_started.html#connection-events
# check here if we need to work with authentication for messages (this is a way to provide
# auth tokens with the messages)
