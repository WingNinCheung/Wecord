from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from ..models.db import Server_User, db, Server, Channel, Message

message_routes = Blueprint("message_routes", __name__)


# 1.) feed channelID & userId to backend to create message
# or
# 2.) send in request body

# create message
@message_routes.route("/", methods=["POST"])
@login_required
def create_message():
    print("YO YO OYOYO YOYOYO ***************!@@@@@@@38u49283252")
    print(request.json)


    newMessage = Message(
        userId=request.json["userId"],
        channelId=request.json["channelId"],
        message=request.json["message"]
        )

    db.session.add(newMessage)
    db.session.commit()
    return newMessage.to_dict()


# edit message
@message_routes.route("/<int:userId>/<int:messageId>/edit", methods=["PUT"])
@login_required
def channels_edit(userId, messageId):

    message = Message.query.get(messageId)

    if userId == message.userId:
        message.message = request.json["message"]
        db.session.commit()
        return message.to_dict()
    else:
        return jsonify({"Only the message author may edit this message"})


# delete message
@message_routes.route("/<int:userId>/<int:messageId>/delete", methods=["DELETE"])
def delete_server(userId, messageId):
    # userId is the id of the user submitting this request

    # message= Message.query.filter_by(id=messageId)

    message = Message.query.get(messageId)
    print("backend delete testing:__________________")
    print(message)
    print(messageId)
    # check if the user submitting this request is the message author
    if userId == message.userId:
        db.session.delete(message)
        db.session.commit()
    return jsonify(messageId)
    # return message.to_dict()
    else:
        return jsonify({"Only the message author may delete this message"})
