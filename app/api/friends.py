from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from ..models.db import  db, Friend
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
    db.session.add(newfriend)
    db.session.add(otherfriend)
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
