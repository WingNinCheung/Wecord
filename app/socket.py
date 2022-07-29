from flask_socketio import SocketIO, join_room, leave_room
from flask import request, jsonify
import os
from .models.db import db, Message, Channel
from .api.server_routes import get_channel_messages
origins = [
    "http://wecord.herokuapp.com/",
    "https://wecord.herokuapp.com/"
]
# set CORS for security
if os.environ.get("FLASK_ENV") != "production":
    origins="*"

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

    # add NEW message to the database
    print("------------- New Message ------------------")
    message = Message(
        userId=data["userId"],
        channelId=data["channelId"],
        message=data["message"]
    )

    db.session.add(message)
    db.session.commit()
    socketio.emit("chat", data, broadcast=True)

@socketio.on("edit")
def handle_edit(data):
    # data here is a single message

    print("------------- Edit Mode ------------------")
    message = Message.query.get(data["messageId"])
    print("-------------message text---------", data["message"])
    print("-------------message.userId---------", message.userId)

    # doublecheck that the actual user is editing their own message
    if data["userId"] == message.userId:
        print("------------- Passed user ID check ------------------")

        message.message = data["message"]
        db.session.commit()

        newMessages = get_channel_messages(data["channelId"])

        socketio.emit("edit", newMessages, broadcast=True)

    else:
        socketio.send({"Only the message author may edit this message"})

# join a chatroom
@socketio.on("join")
def on_join(data):

    # let's get room name by channelId
    channel = Channel.query.get(data["channelId"])

    username = data['username']
    room = channel.title
    join_room(room)
    # to=room means that only someone connected to this room can see what's happening here
    socketio.send(username + " has entered the room", to=room)

# test to see if we can have a connection event
# @socketio.on('connect')
# def test_connect(auth):
#     socketio.emit('my response', {'data': 'Connected'})

# leave a chatroom
@socketio.on('leave')
def on_leave(data):
    channel = Channel.query.get(data["channelId"])

    username = data['username']
    room = channel.title
    leave_room(room)
    socketio.send(username + " has left the channel.", to=room)

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
