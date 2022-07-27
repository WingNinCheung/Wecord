import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

// initialize socket variable
let socket;

export default function Chat() {

    //TODO: double check that this is the user
    const user = useSelector(state => state.session.user)

    // user messages
    const [messages, setMessages] = useState([]);
    // controlled form input
    const [chatInput, setChatInput] = useState("");

    useEffect(() => {

        // create websocket/connect
        socket = io();

        // listen for chat events (chat parameter is an event)
        socket.on("chat", (chat) => {
            // when we receive a chat, add to our messages array in state
            setMessages(messages => [...messages, chat])
        })

        // disconnect upon component unmount
        return (() => {
            socket.disconnect()
        })
    }, []);

    const sendChat = (e) => {
        e.preventDefault();
        // emit a message
        socket.emit("chat", { user: user.username, msg: chatInput });
        // clear input field after message is sent
        setChatInput("")
    }

  return (
    <>
        <div className="messagesDisplay">
            {messages.map((message, i) => (
                <div key={i}>
                    {`${message.user}: ${message.msg}`}
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
