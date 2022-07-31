from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user

from ..models.db import Server_User, db, Server, Channel, Message
from ..models.user import User

server_routes = Blueprint("server_routes", __name__)

# # GET /api/servers/:serverId - read a single server
# @server_routes.route('/<int:id>')
# def single_server(id):
#     print(id)
#     server = Server.query.get(id)
#     return server.to_dict()

# GET /api/servers - read all servers
@server_routes.route("/yourServers/<int:userId>")
@login_required
def all_servers(userId):
    # get all server_user instances for a single user
    serverUsers = Server_User.query.filter(Server_User.userId == userId).all()
    #print('--------------------------------- server Users',serverUsers)
    #print('$$$$$$$$$$$$$$$$$$$############ each server',{'server': [server.server.to_dict() for server in serverUsers]})
    # Get user object for current user
    currentUser = User.query.get(userId)
    # get all servers, fill notIn with servers the user is not a member of
    servers = Server.query.all()
    notIn = []
    serverspub = Server.query.filter(Server.private == False).all()
    for server in serverspub:
        bool = True
        for use in server.users:
            print(use.user, currentUser)
            if currentUser == use.user:
                bool = False
        if bool:
            notIn.append(server)

    # send the conversation partners of the current user- everyone else in the server
    # send array of usernames

    # yourservers = []
    # # for each of the current user's servers
    # for server in serverUsers:
    #     # yourServer is a server instance in dictionary format
    #     yourServer = server.server.to_dict()
    #     yourServer["conversation_partners"] = []

    #     users_in_each_server = server.server.users

    #     # get the users in each of those servers and put their names into a list.
    #     # exclude the current user's name
    #     for user in users_in_each_server:
    #         if currentUser.username not in user.user.username:
    #             yourServer["conversation_partners"].append(user.user.username)
    #             yourservers.append(yourServer)



    # we also want to send the server_users for each server to the state.
    print('allnotin@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',notIn)
    # return {"servers": [server.to_dict() for server in servers], 'yourservers': yourservers, 'serversnotin': [server.to_dict() for server in notIn]}
    return {"servers": [server.to_dict() for server in servers], 'yourservers': [server.server.to_dict() for server in serverUsers], 'serversnotin': [server.to_dict() for server in notIn]}


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


# TODO: Fix front end route for this
# DELETE /api/servers/:serverId - delete a server
@server_routes.route("/<int:serverId>/<int:userId>/delete", methods=["DELETE"])
def delete_server(serverId, userId):
    # userId is the id of the user submitting this request
    print(
        "----%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%-inside---------%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%------"
    )

    server = Server.query.get(serverId)
    # Check that the user submitting request is the master admin
    if userId == server.master_admin:
        db.session.delete(server)
        db.session.commit()
        return server.to_dict()
    else:
        return jsonify({"Only the server admin may delete this server"})


@server_routes.route('/private/<int:userId>')
def checkUserInServer(userId):
    serverUsers = Server_User.query.filter(Server_User.userId == userId).all()
    print('$$$$$$$$$$$$$$$$$$$############',serverUsers)
    print('$$$$$$$$$$$$$$$$$$$############',{'server': [server.server.to_dict() for server in serverUsers]})

    return {'yourservers': [server.server.to_dict() for server in serverUsers]}



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
@server_routes.route(
    "/<int:serverId>/channels/<int:channelId>/delete", methods=["DELETE"]
)
@login_required
def delete_channel(serverId, channelId):

    target_channel = Channel.query.filter_by(id=channelId)
    channel = Channel.query.filter(Channel.id == channelId).all()
    print("******", channel[0])
    db.session.delete(channel[0])
    # target_channel.delete()
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


# read all messages of a single channel
# each message looks like:
#  {'id': 2, 'userId': 1, 'channelId': 1, 'message': 'Who loves javascript'}
@server_routes.route("/channels/<int:id>")
@login_required
def get_channel_messages(id):
    channel = Channel.query.get(id)
    target_channel = channel.to_dict()
    # use a for loop to append the corresponding username and photo to each message
    for i, message in enumerate(target_channel["messages"]):
        message["user"] = channel.messages[i].user.username
        message["userPhoto"] = channel.messages[i].user.photo
    return {"messages": target_channel["messages"]}
