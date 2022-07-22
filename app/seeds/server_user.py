from ..models.db import db, Server, Channel, Message, Server_User


# Adds a demo user, you can add other users here if you want
def seed_server_users():
    server_users1 = Server_User(
        serverId = 1, userId = 1, adminStatus = True, muted = False )
    server_users2 = Server_User(
        serverId = 1, userId = 2, adminStatus = False, muted = False )
    server_users3 = Server_User(
        serverId = 1, userId = 3, adminStatus = False, muted = False )
    server_users4 = Server_User(
        serverId = 2, userId = 1, adminStatus = True, muted = False )
    server_users5 = Server_User(
        serverId = 2, userId = 2, adminStatus = False, muted = False )
    server_users6 = Server_User(
        serverId = 3, userId = 1, adminStatus = True, muted = False )
    server_users7 = Server_User(
        serverId = 4, userId = 1, adminStatus = True, muted = False )
    server_users8 = Server_User(
        serverId = 4, userId = 3, adminStatus = False, muted = False )
    server_users9 = Server_User(
        serverId = 5, userId = 1, adminStatus = True, muted = False )
    server_users10 = Server_User(
        serverId = 6, userId = 2, adminStatus = True, muted = False )
    server_users11 = Server_User(
        serverId = 6, userId = 3, adminStatus = False, muted = False )
    server_users12 = Server_User(
        serverId = 7, userId = 3, adminStatus = True, muted = False )





    db.session.add(server_users2)
    db.session.add(server_users1)
    db.session.add(server_users3)
    db.session.add(server_users4)
    db.session.add(server_users5)
    db.session.add(server_users6)
    db.session.add(server_users7)
    db.session.add(server_users8)
    db.session.add(server_users9)
    db.session.add(server_users10)
    db.session.add(server_users11)
    db.session.add(server_users12)


    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_server_users():
    db.session.execute('TRUNCATE serverusers RESTART IDENTITY CASCADE;')
    db.session.commit()
