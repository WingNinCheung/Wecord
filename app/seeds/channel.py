from ..models.db import db, Server, Channel, Message, server_users


# Adds a demo user, you can add other users here if you want
def seed_channels():
    channel1 = Channel(serverId = 1, title = "channel1")
    channel2 = Channel(serverId = 1, title = "channel2")
    channel3 = Channel(serverId = 1, title = "channel3")
    channel4 = Channel(serverId = 2, title = "channel4")
    channel5 = Channel(serverId = 2, title = "channel5")
    channel6 = Channel(serverId = 3, title = "channel6")
    channel7 = Channel(serverId = 3, title = "channel7")
    channel8 = Channel(serverId = 4, title = "channel8")
    channel9 = Channel(serverId = 4, title = "channel9")
    channel10 = Channel(serverId = 5, title = "channel10")
    channel11 = Channel(serverId = 6, title = "channel11")
    channel12 = Channel(serverId = 7, title = "channel12")

    db.session.add(channel1)
    db.session.add(channel2)
    db.session.add(channel3)
    db.session.add(channel4)
    db.session.add(channel5)
    db.session.add(channel6)
    db.session.add(channel7)
    db.session.add(channel8)
    db.session.add(channel9)
    db.session.add(channel10)
    db.session.add(channel11)
    db.session.add(channel12)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_channels():
    db.session.execute('TRUNCATE servers RESTART IDENTITY CASCADE;')
    db.session.commit()
