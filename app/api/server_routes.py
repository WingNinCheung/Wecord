from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from ..models.db import Server_User, db, Server, Channel

server_routes = Blueprint("server_routes", __name__)

# # GET /api/servers/:serverId - read a single server
# @server_routes.route('/<int:id>')
# def single_server(id):
#     print(id)
#     server = Server.query.get(id)
#     return server.to_dict()

# GET /api/servers - read all servers
@server_routes.route("/")
# @login_required
def all_servers():
    servers = Server.query.all()
    return {"servers": [server.to_dict() for server in servers]}


# POST /api/servers - create a new public server
@server_routes.route("/add", methods=["POST"])
@login_required
def new_server():
    name = request.json["name"]
    private = request.json["private"]
    picture = request.json["picture"]
    master_admin = request.json["master_admin"]

    server = Server(
        name=name,
        private=private,
        picture=picture,
        master_admin=master_admin,
    )

    db.session.add(server)
    db.session.commit()

    server_user = Server_User(
        serverId=server.id, userId=server.master_admin, adminStatus=True, muted=False
    )
    db.session.add(server_user)
    db.session.commit()
    return server.to_dict()


# # POST /api/servers - create a new private server
# # TODO: copy/paste public version once that's debugged

# PUT /api/servers/:serverId - update server info
@server_routes.route("/<int:id>/edit", methods=["PUT"])
@login_required
def edit_server(id):
    server = Server.query.get(id)
    data = request.json
    print("data")
    # server.master_admin = current_user.id
    server.name = data["name"]
    # server.private skip for now
    # server.picture = data['picture']
    db.session.commit()
    return server.to_dict()


#TODO: Fix front end route for this
# DELETE /api/servers/:serverId - delete a server
@server_routes.route("/<int:serverId>/<int:userId>/delete", methods=["DELETE"])
def delete_server(serverId, userId):
    # userId is the id of the user submitting this request


    server = Server.query.get(serverId)
    # Check that the user submitting request is the master admin
    if userId == server.master_admin:
        db.session.delete(server)
        db.session.commit()
        return server.to_dict()
    else:
        return jsonify({"Only the server admin may delete this server"})


# ------------------------- Routes for channels -------------------------------------
# read all channels of a single server
@server_routes.route("/<int:id>/channels")
@login_required
def get_server_channels(id):
    server = Server.query.get(id)
    serverchannels = server.to_dict()
    return {"channels": serverchannels["channels"]}


# create a new channel in a server
@server_routes.route("/<int:serverId>/channels/create", methods=["post"])
@login_required
def create_channels(serverId):

    newChannel = Channel(title=request.json["title"], serverId=request.json["serverId"])

    db.session.add(newChannel)
    db.session.commit()
    return newChannel.to_dict()


# edit a channel
@server_routes.route("/<int:id>/channels/<int:channelId>/edit", methods=["PUT"])
@login_required
def channels_edit(id, channelId):

    # channel = Channel.query.filter(Channel.id == channelId).all()
    channel = Channel.query.get(channelId)
    title = request.json["title"]
    print((channel))
    channel.title = title
    db.session.add(channel)
    db.session.commit()
    return channel.to_dict()


# delete a channel
@server_routes.route("/<int:serverId>/channels/<int:channelId>/delete", methods=["DELETE"])
@login_required
def delete_channel(serverId, channelId):
    print("********************backend delete")
    target_channel = Channel.query.filter_by(id=channelId)
    target_channel.delete()
    db.session.commit()
    # return jsonify({"Already deleted"})
    return jsonify(channelId)

# ------------------------- Routes for messages -------------------------------------

# read all messages of a single channel
# @server_routes.route("/<int:serverId>/<int:channelId>")
# @login_required
# def get_channel_messages(serverId, channelId):
#     channel = Channel.query.get(channelId)
#     target_channel = channel.to_dict()
#     print("backend target channel:")
#     print(target_channel["messages"])
#     return {target_channel["messages"]}


@server_routes.route("/channels/<int:id>")
@login_required
def get_channel_messages(id):
    channel = Channel.query.get(id)
    target_channel = channel.to_dict()
    print(target_channel["messages"])
    return {"messages": target_channel["messages"]}
