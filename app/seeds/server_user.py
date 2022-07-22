from ..models.db import db, Server, Channel, Message, Server_Users


# Adds a demo user, you can add other users here if you want
def seed_server_users():
    Server_Users1 = Server_Users(
        serverId = 1, userId = 1, adminStatus = True, muted = True )
    Server_Users2 = Server_Users(
        serverId = 1, userId = 2, adminStatus = False, muted = True )
    Server_Users3 = Server_Users(
        serverId = 1, userId = 3, adminStatus = False, muted = True )
    Server_Users4 = Server_Users(
        serverId = 2, userId = 1, adminStatus = True, muted = True )
    Server_Users5 = Server_Users(
        serverId = 2, userId = 2, adminStatus = False, muted = True )
    Server_Users6 = Server_Users(
        serverId = 3, userId = 1, adminStatus = True, muted = True )
    Server_Users7 = Server_Users(
        serverId = 4, userId = 1, adminStatus = True, muted = True )
    Server_Users8 = Server_Users(
        serverId = 4, userId = 3, adminStatus = False, muted = True )
    Server_Users9 = Server_Users(
        serverId = 5, userId = 1, adminStatus = True, muted = True )
    Server_Users10 = Server_Users(
        serverId = 6, userId = 2, adminStatus = True, muted = True )
    Server_Users11 = Server_Users(
        serverId = 6, userId = 3, adminStatus = False, muted = True )
    Server_Users12 = Server_Users(
        serverId = 7, userId = 3, adminStatus = True, muted = True )


    # statement = student_identifier.insert().values(, user_id=sti1.id)




    db.session.add(Server_Users2)
    db.session.add(Server_Users1)
    db.session.add(Server_Users3)
    db.session.add(Server_Users4)
    db.session.add(Server_Users5)
    db.session.add(Server_Users6)
    db.session.add(Server_Users7)
    db.session.add(Server_Users8)
    db.session.add(Server_Users9)
    db.session.add(Server_Users10)
    db.session.add(Server_Users11)
    db.session.add(Server_Users12)


    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_Server_Users():
    db.session.execute('TRUNCATE servers RESTART IDENTITY CASCADE;')
    db.session.commit()
