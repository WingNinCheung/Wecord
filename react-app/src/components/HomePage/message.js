import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, getChannelMessagesThunk } from "../../store/messages";
import { useHistory } from "react-router-dom";

export default function CreateMessageForm({ channelId, userId, getMessages}) {

    if (channelId) {
        console.log("channelID from create message form",channelId)
    }
    const [message, setMessage] = useState("")
    const [validationErrors, setValidationErrors] = useState([]);

    const dispatch = useDispatch();
    const history = useHistory();

    const handleMessageSubmit = async (e) => {
        e.preventDefault();

        const data = {
            message,
            userId,
            channelId
        };

        console.log("Message data from messages.js: ", data)

        const newMessage = await dispatch(createMessage(data));

        if (newMessage) {
            // dynamically load messages again
            await dispatch(getMessages(channelId));
        }

    }

    const handleCancel = (e) => {
        e.preventDefault();
        history.push("/home");
      };


    useEffect(() => {
        const errors = [];

        if (!message.length) {
            errors.push("Server name cannot be empty!");
        }
        setValidationErrors(errors);
    }, [message]);

    if (!userId) return <p className="loading">"Loading..."</p>
    return (
        <div className="createMessageForm">
            <h3>Create a message</h3>
            <form onSubmit={handleMessageSubmit}>
                <ul>
                    {validationErrors.map((error) => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
                <textarea
                    className="create-message"
                    placeholder={message}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button disabled={validationErrors.length > 0}>Create</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>


        </div>
    )
}
