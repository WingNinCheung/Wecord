import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { getChannelMessagesThunk, createMessage, editMessageThunk, deleteMessageThunk } from '../../../store/messages';
import EditMessageForm from './editMessageForm';

// initialize socket variable
let socket;

export default function Chat({ channelId }) {

    //TODO: double check that this is the user
    const user = useSelector(state => state.session.user)
    const oldMessages = useSelector(state => state.messages);

    const dispatch = useDispatch();

    // user messages
    const [messages, setMessages] = useState([]);
    // controlled form input
    const [chatInput, setChatInput] = useState("");

    const [validationErrors, setValidationErrors] = useState([]);

    const [openEditForm, setOpenEditForm] = useState(false);
    const [messageId, setMessageId] = useState("");
    const [messageUserId, setMessageUserId] = useState("");

    const [deleteStatus, setDeleteStatus] = useState(false);

    useEffect(() => {
        if (deleteStatus) {
          dispatch(deleteMessageThunk(user.id, messageId))
        }
        setDeleteStatus(false);
      }, [dispatch, deleteStatus]);


    // Run messages load here on page load:
    useEffect(() => {
        if (oldMessages) {
            (async () => {
                await dispatch(getChannelMessagesThunk(channelId));
                await setMessages(Object.values(oldMessages));
            })();
        }
        console.log("the messages: ", messages)
    }, [socket])


    // Run socket stuff (so connect/disconnect ) whenever channelId changes
    useEffect(() => {
        // create websocket/connect
        socket = io();

        socket.on("connect", () => {
            console.log("We are connected test")
            socket.emit("join", {"username": user.username, "channelId": channelId} )
        })

        // listen for chat events (chat parameter is an event)
        socket.on("chat", (chat) => {
            // when we receive a chat, add to our messages array in state
            setMessages(messages => [...messages, chat])
        })

        // listen for edited messages (oldMessage is the edited one)
        socket.on("edit", (updatedMessages) => {
            // when we receive a chat, add to our messages array in state

            // step 1: load all of the updatedMessage's channel messages (if they aren't already there)
            // step 2: find the updatedMessage's old version in the messages array
            // step 3: replace the old version with the new version
            // step 4: setMessages

            // or

            // step 1: after updating the message, have a useEffect reload all the messages
            // step 2: setMessage


            // THIS SOLUTION WORKS but changes the comment order.
            // const filtered = updatedMessages.messages.filter(message => {
            //     return message && message.channelId === channelId
            // });
            // setMessages([...filtered])


            // this is so ghetto lool
            const filtered = [];
            for (let i = 0; i < updatedMessages.messages.length; i++) {
                let message = updatedMessages.messages[i];
                if (message && message.channelId === channelId) {
                    filtered.push(message)
                }
            }
            // updatedMessages.messages.forEach((message) => {
            //     if (message.channelId === channelId) {
            //         messages[message.id] = message;
            //     }
            // });

            console.log(filtered);
            setMessages([...filtered])
            console.log(messages)

            // filtered example
            // [
            //     {
            //       "id": 5,
            //       "userId": 1,
            //       "channelId": 3,
            //       "message": "apple",
            //       "user": "Demo",
            //       "userPhoto": null
            //     },
            //     {
            //       "id": 42,
            //       "userId": 1,
            //       "channelId": 3,
            //       "message": "Penith",
            //       "user": "Demo",
            //       "userPhoto": null
            //     },
            //     {
            //       "id": 50,
            //       "userId": 1,
            //       "channelId": 3,
            //       "message": "instant!",
            //       "user": "Demo",
            //       "userPhoto": null
            //     },
            //     {
            //       "id": 51,
            //       "userId": 1,
            //       "channelId": 3,
            //       "message": "wrefgweg",
            //       "user": "Demo",
            //       "userPhoto": null
            //     }
            //   ]




            // if (messages.length) {

            //     console.log("Is anything even printing here in edit");
            //     // replace the old message w updated one
            //     // console.log("Messages in general over here: ", messages)
            //     //NOTE: The error here is that messages comes out being from the wrong channel. not the current one
            //     async function updateMessages() {
            //         await dispatch(getChannelMessagesThunk(channelId));
            //         await setMessages(Object.values(oldMessages));
            //     };

            //     updateMessages();

            //     // FIND THE ID OF THE UPDATED MESSAGE
            //     // INSIDE OF THE EXISTING MESSAGES

            //     const getIndexOfUpdatedMessage = (updatedMessage) => {
            //         if (oldMessages) {
            //             for (let i = 0; i < oldMessages.length; i++) {
            //                 console.log("In function: actual messages", oldMessages);
            //                 console.log("In function: channel ID: ", channelId)
            //                 console.log("In function: the updated Message: ", updatedMessage)
            //                 console.log("in function: updatedMessage[messageId]: ", updatedMessage["messageId"])
            //                 if (messages[i].id == updatedMessage["messageId"]) {
            //                     console.log("Channel of these messages rn: ", messages[i].channelId)
            //                     return i;
            //                 }
            //             }

            //         }
            //     };

            //     let updatedMessages = [...messages];
            //     let index = getIndexOfUpdatedMessage(updatedMessage);
            //     console.log("edited message index in messages ", index) // returns undefined
            //     console.log("actual messages state: ", messages);
            //     console.log("updated messages state: ", updatedMessages);

            //     // if message Index was found, then we can change that position in the state w new value
            //     if (index) {
            //         console.log("we edited the message in the local state!")
            //         updatedMessages[index] = updatedMessage;
            //     }


            //     // const updatedMessages = [...messages];
            //     // testing this to see if it updates state dynamically
            //     console.log("Updated messages before we set them: ", [...updatedMessages])
            //     // setMessages([...updatedMessages]);

            // }
        })

        // disconnect upon component unmount
        return (() => {
            // note: I don't think leave is necessary cuz disconnect leaves all rooms but this is just for
            // logging when ppl leave for now
            socket.emit("leave", {"username": user.username, "channelId": channelId})
            socket.disconnect()
        })
    }, [channelId]);



    const updateChatInput = (e) => {
        setChatInput(e.target.value)
    };

    const sendChat = (e) => {
        e.preventDefault();
        // emit a message

        // last object value tells database to edit message or not
        if (chatInput !== "") {

            if (openEditForm) {
                if (messageId) { //need messageId or edit gets messed up
                    socket.emit("edit", { user: user.username, message: chatInput, userId: user.id, channelId: channelId, messageId: messageId, messageUserId: messageUserId });
                }
            } else {
                socket.emit("chat", { user: user.username, message: chatInput, userId: user.id, channelId: channelId});
            }
            console.log("Channel ID in the sendChat function: ", channelId)
            // we seem to be grabbing the correct info
        }

        setChatInput("")
    }
    if (!oldMessages || !channelId || !socket) return <p className="loading">Loading</p>
  return (
    <div className="container-message">
        <div className="messagesDisplay">
            {messages.map((message, i) => (
                <div key={i} className="singleMessageDisplay">
                    <div className="username">
                        <i className="fa-solid fa-user"></i>
                        {message.user}
                    </div>
                    <div className="msg-body">
                        <span className="message">{message.message}</span>
                    </div>
                    <span
                        onClick={() => {
                            setMessageId(message.id);
                            setOpenEditForm(true);
                            setMessageUserId(message.userId);
                        }}
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                    </span>
                    <span
                        onClick={() => {
                            setMessageId(message.id);
                            setDeleteStatus(true);
                            setMessageUserId(message.userId);
                        }}
                        >
                        <i className="fa-solid fa-trash-can"></i>
                    </span>
                </div>
            ))}
        </div>
        <div className="message-form form">
            <div className="createMessageForm">
                {openEditForm ? (
                    <EditMessageForm
                        messageId={messageId}
                        userId={user.id}
                        setShow={setOpenEditForm}
                        msgUserId={messageUserId}
                        chatInput={chatInput}
                        updateChatInput={updateChatInput}
                        sendChat={sendChat}
                    />
                ) : (
                <form onSubmit={sendChat}>
                    <ul>
                        {validationErrors.map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                    <textarea
                        className="create-message"
                        placeholder="Write messages here"
                        value={chatInput}
                        onChange={updateChatInput}
                    />
                    <button type="Submit" disabled={validationErrors.length > 0} className="send-button">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </form>
                )}
            </div>
        </div>
    </div>
  )
}
