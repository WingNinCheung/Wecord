import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getChannelMessagesThunk, editMessageThunk, createMessage, deleteMessageThunk } from '../../../store/messages';
import CreateMessageForm from '../createMessageForm';
import EditMessageForm from '../editMessageForm';

// initialize socket variable
let socket;

export default function Chat({ channelId }) {

    //TODO: double check that this is the user
    const user = useSelector(state => state.session.user)
    const oldMessages = useSelector(state => state.messages);

    const dispatch = useDispatch();
    const history = useHistory();

    // user messages
    const [messages, setMessages] = useState([]);
    // controlled form input
    const [chatInput, setChatInput] = useState("");

    const [openEditForm, setOpenEditForm] = useState(false);
    const [messageId, setMessageId] = useState("");
    const [messageUserId, setMessageUserId] = useState("");

    const [deleteStatus, setDeleteStatus] = useState(false);

    useEffect(() => {
        if (deleteStatus) {
          dispatch(deleteMessageThunk(user.id, messageId)).then(() =>
            dispatch(getChannelMessagesThunk(channelId))
          );
        }
        setDeleteStatus(false);
        history.push("/home");
      }, [dispatch, deleteStatus]);

    // FOR TESTING ONLY:
    // const channelId = 1;
    const channelName = "Biscuits";

    const createMessage = async (message) => {
        await dispatch(createMessage(message));
    }

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

    useEffect(() => {
        // create websocket/connect
        socket = io();

        socket.on("connect", () => {
            console.log("We are connected test")
        })

        // listen for chat events (chat parameter is an event)
        socket.on("chat", (chat) => {
            // when we receive a chat, add to our messages array in state
            setMessages(messages => [...messages, chat])
        })

        // test joining a chat room
        // socket.on("join", (room) => {
        //     // not sure if "channelId" needs to be string or int
        //     room = { "username": user.username, "channelId": channelId }
        //     room.join(channelName);
        //     // loadAllMessages();
        // })

        // disconnect upon component unmount
        return (() => {
            socket.disconnect()
        })
    }, []);

    const updateChatInput = (e) => {
        setChatInput(e.target.value)
    };

    const sendChat = (e) => {
        e.preventDefault();
        // emit a message
        if (chatInput !== "") {
            socket.emit("chat", { user: user.username, message: chatInput, userId: user.id, channelId: channelId });
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
            <CreateMessageForm
                channelId={channelId}
                userId={user.id}
                getMessages={getChannelMessagesThunk}
            />
            {/* edit message form should be moved later to be where message is */}
            {openEditForm && (
                <EditMessageForm
                  messageId={messageId}
                  userId={user.id}
                  setShow={setOpenEditForm}
                  msgUserId={messageUserId}
                />
            )}
        </div>
        <form onSubmit={sendChat}>
            <input
                value={chatInput}
                onChange={updateChatInput}
            />
            <button type="submit">Send</button>
        </form>
    </div>
  )
}
