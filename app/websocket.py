from flask_socketio import SocketIO
from .__init__ import os

# set CORS for security
if os.environ.get("FLASK_ENV") == "production":
    origins = [
    "http://wecord.herokuapp.com/",
    "https://wecord.herokuapp.com/"
]
else:
    origins = "*"


# create SocketIO instance
socketio = SocketIO(cors_allowed_origins=origins)


# handle chat
@socketio.on("chat")
def handle_chat(data):
    socketio.emit("chat", data, broadcast=True)

#Unlike with a Flask route handler, we will not need to have an actual return statement-
#we send messages explicitly using emit or send functions.
