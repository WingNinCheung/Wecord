from ..models.db import db, Server, Channel, Message, server_users


# Adds a demo user, you can add other users here if you want
def seed_servers():
    server1 = Server(
        master_admin = 1, name = "example", private=False, picture=None)
    server2 = Server(
        master_admin = 1, name = "example2", private=False, picture=None)
    server3 = Server(
        master_admin = 1, name = "example3", private=False, picture=None)
    server4 = Server(
        master_admin = 1, name = "example4", private=True, picture=None)
    server5 = Server(
        master_admin = 1, name = "example5", private=True, picture=None)
    server6 = Server(
        master_admin = 2, name = "example6", private=False, picture=None)
    server7 = Server(
        master_admin = 3, name = "example7", private=False, picture=None)

    db.session.add(server1)
    db.session.add(server2)
    db.session.add(server3)
    db.session.add(server4)
    db.session.add(server5)
    db.session.add(server6)
    db.session.add(server7)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_servers():
    db.session.execute('TRUNCATE servers RESTART IDENTITY CASCADE;')
    db.session.commit()
