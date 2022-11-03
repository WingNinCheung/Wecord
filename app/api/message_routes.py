from flask import Blueprint, jsonify, request, redirect
from flask_socketio import SocketIO, join_room, leave_room, disconnect, emit, connect
import os
from flask_login import login_required, current_user
from ..models.db import Server_User, db, Server, Channel, Message
import functools

message_routes = Blueprint("message_routes", __name__)


if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://wecord.herokuapp.com",
        "https://wecord.herokuapp.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins="*", logger=True, engineio_logger=True)

# 1.) feed channelID & userId to backend to create message
# or
# 2.) send in request body

# custom wrap to disconnect non-authenticated user
def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            disconnect()
        else:
            return f(*args, **kwargs)
    return wrapped

# connect and confirm validation
@socketio.on("connect")
def connect_to_socket():
    # check authentication
    if current_user.is_authenticated:
        emit('my response',
                {'message': '{0} has joined'.format(current_user.name)},
                broadcast=True)
    else:
        return False  # not allowed here
    # s = request.sid


# connect to chat
@socketio.on("chat")
@authenticated_only
def handle_chat(data):
    # broadcast=True means that all users connected to this chat will see the message

    # add NEW message to the database
    print("------------- New Message ------------------")
    message = Message(
        userId=data["userId"],
        channelId=data["channelId"],
        message=data["message"]
    )

    print("***************"*50, message)

    db.session.add(message)
    db.session.commit()
    socketio.emit("chat", message.to_dict(), broadcast=True)


# edit a message
@socketio.on("edit")
@authenticated_only
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
        socketio.emit("edit", message.to_dict(), broadcast=True)

    else:
        socketio.send({"Only the message author may edit this message"})


# delete message
@socketio.on("delete")
@authenticated_only
def handle_delete(data): # make sure to send userId & messageId at least
    message = Message.query.get(data.messageId)
    print("backend delete testing:__________________")
    print(message)
    # check if the user submitting this request is the message author
    if current_user.id == message.userId:
        db.session.delete(message)
        db.session.commit()
        socketio.send({"Message deleted."})
    else:
        return jsonify({"Only the message author may delete this message"})



# @message_routes.route("/", methods=["POST"])
# @login_required
# def create_message():

#     newMessage = Message(
#         userId=request.json["userId"],
#         channelId=request.json["channelId"],
#         message=request.json["message"],
#     )

#     db.session.add(newMessage)
#     db.session.commit()
#     return newMessage.to_dict()


# edit message
# @message_routes.route("/<int:userId>/<int:messageId>/edit", methods=["PUT"])
# @login_required
# def channels_edit(userId, messageId):

#     message = Message.query.get(messageId)

#     if userId == message.userId:
#         message.message = request.json["message"]
#         db.session.commit()
#         return message.to_dict()
#     else:
#         return jsonify({"Only the message author may edit this message"})


# delete message
# @message_routes.route("/<int:userId>/<int:messageId>/delete", methods=["DELETE"])
# def delete_server(userId, messageId):
#     # userId is the id of the user submitting this request

#     # message= Message.query.filter_by(id=messageId)

#     message = Message.query.get(messageId)
#     print("backend delete testing:__________________")
#     print(message)
#     print(messageId)
#     # check if the user submitting this request is the message author
#     if userId == message.userId:
#         db.session.delete(message)
#         db.session.commit()
#         return jsonify(messageId)
#     # return message.to_dict()
#     else:
#         return jsonify({"Only the message author may delete this message"})
