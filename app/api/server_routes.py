from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from ..models import db

servers = Blueprint('servers', __name__)

#NOTE: Might want to add jsonify for the return statements so that the responses have the correct headers

# GET /api/servers/:serverId - read a single server
@servers.route('/<int:id>')
@login_required
def single_server(id):
    server = db.Server.query.get(id)
    return server.to_dict()

# GET /api/servers - read all servers
@servers.route('/')
@login_required
def all_servers():
    servers = db.Server.query.all()
    return {'servers': [server.to_dict() for server in servers]}

# POST /api/servers - create a new public server
@servers.route('/', methods= ['POST'])
@login_required
def new_server():
    data = request.json
    server = db.Server(
        # NOTE: check what current_user looks like so we know what the id is
        master_admin = current_user.id,
        name = data['name'],
        private = False,
        picture = data['picture']
    )
    db.session.add(server)
    db.session.commit()
    return server.to_dict()

# POST /api/servers - create a new private server
# TODO: copy/paste public version once that's debugged

# PUT /api/servers/:serverId - update server info
@servers.route('/<int:id>', methods= ['PUT'])
@login_required
def edit_server(id):
    server = db.Server.query.get(id)
    data = request.json
    server.master_admin = current_user.id
    server.name = data['name']
    # server.private skip for now
    server.picture = data['picture']
    db.session.commit()
    return server.to_dict()

# DELETE /api/servers/:serverId - delete a server
@servers.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_server(id):
    server = db.Server.query.get(id)
    # Verify that this current_user.id method works
    if current_user.id == server.master_admin:
        db.session.delete(server)
        db.session.commit()
        return server.to_dict()
    else:
        return jsonify({"Only the server admin may delete this server"})
