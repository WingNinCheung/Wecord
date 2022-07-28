import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { getChannelMessagesThunk, editMessageThunk, createMessage } from '../../../store/messages';

// initialize socket variable
let socket;

export default function Chat() {

    //TODO: double check that this is the user
    const user = useSelector(state => state.session.user)
    const oldMessages = useSelector(state => state.messages);

    const dispatch = useDispatch();

    // user messages
    const [messages, setMessages] = useState([]);
    // controlled form input
    const [chatInput, setChatInput] = useState("");

    // FOR TESTING ONLY:
    const channelId = 1;
    const channelName = "Biscuits";

    // load all channel messages
    // Note: we use channelId but it is probably more secure to use the socket.io sessionId
    const loadAllMessages = async () => {
        await dispatch(getChannelMessagesThunk(channelId));
        await setMessages(Object.values(oldMessages));
        console.log("the messages state in loadAllMessages after thunk ", oldMessages);
    }

    const createMessage = async (message) => {
        await dispatch(createMessage(message));
    }

    useEffect(() => {

        // let newMessages = loadAllMessages();
        // setMessages(Object.values(newMessages))
        loadAllMessages();
        console.log("the messages: ", messages)
        // create websocket/connect
        socket = io();

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
    <>
        <div className="messagesDisplay">
            {messages.map((message, i) => (
                <div key={i}>
                    <>
                        <img src={message.userPhoto} alt="userpic" />
                        {`${message.user}: ${message.message}`}
                    </>
                </div>
            ))}
        </div>
        <form onSubmit={sendChat}>
            <input
                value={chatInput}
                onChange={updateChatInput}
            />
            <button type="submit">Send</button>
        </form>
    </>
  )
}
// TODO:
// debug the race condition here. so sometimes the messages are loading,
// sometimes the page loads nothing
// the messages are taking HELLA LONG to load.
// load userphoto next to user.
