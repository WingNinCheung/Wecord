import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// A default form component for making messages.
// Just needs a custom handleMessageSubmit handler
export default function MessageForm({ channelId, userId, handleSubmit, message, setMessage }) {

    if (channelId) {
        console.log("channelID from create message form",channelId)
    }
    const [validationErrors, setValidationErrors] = useState([]);

    // set messageText if there is any (for editing, on load)
    // Note: May not work if form loads slowly? possibly this will run before text is loaded
    useEffect(() => {
        if (message) {
            setMessage(message)
        }
    }, [message])

    const history = useHistory();

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


    if (!userId || !channelId ) return <p className="loading">"Loading..."</p>
    return (
        <div className="message-form form">
            <form onSubmit={handleSubmit}>
                <ul>
                    {validationErrors.map((error) => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
                <textarea
                    className="message-text"
                    placeholder={message}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button disabled={validationErrors.length > 0}>Create</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>


        </div>
    )
}
