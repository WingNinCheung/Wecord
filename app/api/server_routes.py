from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from ..models.db import Server_User, db, Server

server_routes = Blueprint("server_routes", __name__)

# NOTE: Might want to add jsonify for the return statements so that the responses have the correct headers

# GET /api/servers/:serverId - read a single server
# @server_routes.route('/<int:id>')
# def single_server(id):
#     server = db.Server.query.get(id)
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
    return server.to_dict()


# # POST /api/servers - create a new private server
# # TODO: copy/paste public version once that's debugged

# PUT /api/servers/:serverId - update server info
@server_routes.route('/<int:id>/edit', methods= ['PUT'])
@login_required
def edit_server(id):
    server = Server.query.get(id)
    data = request.json
    # server.master_admin = current_user.id
    server.name = data['name']
    # server.private skip for now
    # server.picture = data['picture']
    db.session.commit()
    return server.to_dict()

# # DELETE /api/servers/:serverId - delete a server
# @server_routes.route('/<int:id>', methods=['DELETE'])
# def delete_server(id):
#     server = db.Server.query.get(id)
#     # Verify that this current_user.id method works
#     if current_user.id == server.master_admin:
#         db.session.delete(server)
#         db.session.commit()
#         return server.to_dict()
#     else:
#         return jsonify({"Only the server admin may delete this server"})
