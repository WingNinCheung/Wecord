import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import MessageForm from "./MessageForm";

import { editMessage, createMessage } from "../../../store/messages";

export function CreateMessageForm({ channelId, userId, getMessages }) {

    const dispatch = useDispatch();

    // set state for the message text.
    // NOTE: This could possibly cause an error later since we're using in multiple places.
    // if it causes an error, lift the state up to index and drive the props down to here
    const [message, setMessage] = useState("")

    const handleMessageSubmit = async (e) => {
        e.preventDefault();

        const data = {
            message,
            userId,
            channelId
        };

        console.log("Message data from createMessage form: ", data)

        const newMessage = await dispatch(createMessage(data));

        if (newMessage) {
            // dynamically load messages again
            await dispatch(getMessages(channelId));
        }

    }

    return (
        <>
            <h3>Create a message</h3>
            <MessageForm channelId={channelId} userId={userId} getMessages={getMessages} handleSubmit={handleMessageSubmit}
            message={message} setMessage={setMessage}/>
        </>
    )
}

export function EditMessageForm({ channelId, userId, getMessages, messageId, message }) {

    const dispatch = useDispatch();

    const handleMessageSubmit = async (e) => {
        e.preventDefault();

        const data = {
            message,
            userId,
            channelId
        };

        console.log("Message data from createMessage form: ", data)

        const editedMessage = await dispatch(editMessage(userId, messageId, data));

        if (editedMessage) {
            // dynamically load messages again
            await dispatch(getMessages(channelId));
        }

    }

    return (
        <>
            <h3>Edit a message</h3>
            <MessageForm channelId={channelId} userId={userId} handleSubmit={handleMessageSubmit} message={message} />
        </>
    )
}
