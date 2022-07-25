from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from ..models.db import Server_User, db, Server, Channel

server_user_routes = Blueprint("server_user_routes", __name__)

# GET
@server_user_routes.route("/<int:id>")
@login_required
def all_server_users(id):
    print("ID-------------------: ", id)
    server_users = list(Server_User.query.filter(Server_User.serverId == id))
    return {"server_users": [server_user.to_dict() for server_user in server_users]}

# CREATE /api/server_users - read all servers
@server_user_routes.route("/", methods=["POST"])
@login_required
def new_server_user():
    serverId = request.json["serverId"]
    userId = request.json["userId"]

    server_user = Server_User(
        serverId= serverId,
        userId= userId
    )

    db.session.add(server_user)
    db.session.commit()

    return server_user.to_dict()
