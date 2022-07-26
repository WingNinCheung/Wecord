from flask import Blueprint, request, session, redirect
from sqlalchemy.orm import contains_eager, joinedload, Load
from flask_login import login_required
from ..models.db import Server_User, Server, db
from ..models.user import User

server_user_routes = Blueprint("server_user_routes", __name__)
# GET
@server_user_routes.route("/<int:serverId>")
@login_required
def all_server_users(serverId):
    # server_users = []
    # for data in db.session.query(User.id, User.username, Server_User).\
    #                  filter(User.id==Server_User.userId).\
    #                  filter(Server_User.serverId == id).all():
    #                     server_users.append({
    #                         "id": data[0]
    #                     })

    # servers = Server.query.get(id)
    servers = Server_User.query.filter(Server_User.serverId == serverId).all()
    server_users = [
        {"server": server.to_dict(), "user": server.user.to_dict()}
        for server in servers
    ]
    # print("********", {"serverUser": server_users})
    return {"serverUser": server_users}

    # for user in server.users:
    #     server_users.update({user.user.id: user.user.username})
    # print(server_users)
    # return server_users
    # return {{}for i in range(len(server_users))}
    # return {"server_users": [server_user.to_dict() for server_user in server_users]}


# CREATE /api/server_users
@server_user_routes.route("/post", methods=["POST"])
@login_required
def new_server_user():
    serverId = request.json["serverId"]
    userId = request.json["userId"]
    server_user = Server_User(serverId=serverId, userId=userId)
    db.session.add(server_user)
    db.session.commit()
    return {"server": server_user.to_dict(), "user": server_user.user.to_dict()}


@server_user_routes.route("/<int:serverId>/<int:userId>", methods=["DELETE"])
@login_required
def leave_server(serverId, userId):
    serverUser = Server_User.query.filter(
        Server_User.serverId == serverId, Server_User.userId == userId
    ).all()
    # su is session user btw
    su = serverUser[0]
    print(su)
    db.session.delete(su)
    db.session.commit()
    return {"server": su.to_dict(), "user": su.user.to_dict()}
