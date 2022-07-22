from ..models.db import db, Server, Channel, Message, server_users


# Adds a demo user, you can add other users here if you want
def seed_server_users():
    server_users1 = server_users(
        serverId = 1, userId = 1, adminStatus = True, muted = True )
    server_users2 = server_users(
        serverId = 1, userId = 2, adminStatus = False, muted = True )
    server_users3 = server_users(
        serverId = 1, userId = 3, adminStatus = False, muted = True )
    server_users4 = server_users(
        serverId = 2, userId = 1, adminStatus = True, muted = True )
    server_users5 = server_users(
        serverId = 2, userId = 2, adminStatus = False, muted = True )
    server_users6 = server_users(
        serverId = 3, userId = 1, adminStatus = True, muted = True )
    server_users7 = server_users(
        serverId = 4, userId = 1, adminStatus = True, muted = True )
    server_users8 = server_users(
        serverId = 4, userId = 3, adminStatus = False, muted = True )
    server_users9 = server_users(
        serverId = 5, userId = 1, adminStatus = True, muted = True )
    server_users10 = server_users(
        serverId = 6, userId = 2, adminStatus = True, muted = True )
    server_users11 = server_users(
        serverId = 6, userId = 3, adminStatus = False, muted = True )
    server_users12 = server_users(
        serverId = 7, userId = 3, adminStatus = True, muted = True )


    statement = student_identifier.insert().values(, user_id=sti1.id)




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
    db.session.execute('TRUNCATE servers RESTART IDENTITY CASCADE;')
    db.session.commit()
