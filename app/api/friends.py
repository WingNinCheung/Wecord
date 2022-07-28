from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from ..models.db import  Server_User, db, Friend, Server, Channel
from ..models.user import User

friend_routes = Blueprint("friend_routes", __name__)


@friend_routes.route('', methods=['POST'])
def addAFriend():
    userId = request.json['userId']
    friendId = request.json['friendId']
    newfriend = Friend(
        userId = userId,
        friendId = friendId,
        accepted = True
    )
    otherfriend = Friend(
        userId = friendId,
        friendId = userId,
        accepted = False
    )
    newPrivateChat = Server(
        name = friendId,
        private = True,
        master_admin = userId
    )

    db.session.add(newfriend)
    db.session.add(otherfriend)
    db.session.add(newPrivateChat)
    db.session.commit()


    server_user = Server_User(
        serverId = newPrivateChat.id,
        userId=userId,
        adminStatus=False,
        muted=False
    )
    server_user2 = Server_User(
        serverId = newPrivateChat.id,
        userId=friendId,
        adminStatus=False,
        muted=False
    )

    newChannel = Channel(
        title='General Private',
        serverId=newPrivateChat.id
    )
    db.session.add(newChannel)
    db.session.add(server_user)
    db.session.add(server_user2)
    db.session.commit()



    return {'newFriend':newfriend.to_dict()}

#---------------------------------------------------------------


@friend_routes.route('yourfriends/<int:id>')
def getFriend(id):
    friendsList = Friend.query.filter(Friend.userId == id).all()
    # print('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',friendsList[0].user)
    return {'friends': [friend.to_dict() for friend in friendsList], 'eachFriend': [friend.user.to_dict() for friend in friendsList]}

#---------------------------------------------------------------


@friend_routes.route('/<int:userId>/<int:friendId>', methods=['DELETE'])
def unfriend(userId, friendId):
    person = Friend.query.filter(Friend.friendId == userId, Friend.userId == friendId).all()
    person2 = Friend.query.filter(Friend.friendId == friendId, Friend.userId == userId).all()
    for friend in person:
        print(friend)
        db.session.delete(friend)
    for friend in person2:
        print(friend)
        db.session.delete(friend)
    db.session.commit()
    
    return person[0]
