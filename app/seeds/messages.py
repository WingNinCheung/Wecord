from ..models.db import db, Server, Channel, Message


# Adds a demo user, you can add other users here if you want
def seed_messages():
    message1 = Message(
        userId = 1, channelId = 1, message = "Hello World")
    message2 = Message(
        userId = 1, channelId = 1, message = "Who loves javascript")
    message3 = Message(
        userId = 1, channelId = 1, message = "Nothing here")
    message4 = Message(
        userId = 1, channelId = 2, message = "Hello whatever")
    message5 = Message(
        userId = 1, channelId = 3, message = "apple")
    message6 = Message(
        userId = 1, channelId = 4, message = "durian")
    message7 = Message(
        userId = 1, channelId = 5, message = "banana")
    message8 = Message(
        userId = 1, channelId = 6, message = "kiwi")
    message9 = Message(
        userId = 1, channelId = 7, message = "strawberry")
   
    message13 = Message(
        userId = 2, channelId = 8, message = "Hello whatever")
    message14 = Message(
        userId = 3, channelId = 9, message = "Hello whatever")
    message15 = Message(
        userId = 3, channelId = 9, message = "Hello whatever")

    db.session.add(message1)
    db.session.add(message2)
    db.session.add(message3)
    db.session.add(message4)
    db.session.add(message5)
    db.session.add(message6)
    db.session.add(message7)
    db.session.add(message8)
    db.session.add(message9)

    db.session.add(message13)
    db.session.add(message14)
    db.session.add(message15)


    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_messages():
    db.session.execute('TRUNCATE messages RESTART IDENTITY CASCADE;')
    db.session.commit()
