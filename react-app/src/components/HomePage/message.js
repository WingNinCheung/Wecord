import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMessage } from "../../store/messages";
import { useHistory } from "react-router-dom";

export default function CreateMessageForm({ channelId }) {
    if(channelId){
        console.log("channelID",channelId)
    }
    const [message, setMessage] = useState("")
    const [validationErrors, setValidationErrors] = useState([]);
    const sessionUser = useSelector((state) => state.session.user.id);
    const userId = sessionUser.id;
    const dispatch = useDispatch();
    const history = useHistory();

    const handleMessageSubmit = async (e) => {
        e.preventDefault();

        const data = {
            message,
            userId,
            channelId
        };

        const newMessage = await dispatch(createMessage(data));

        if (newMessage) {
            history.push("/home");
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

    return (
        <div className="createMessageForm">
            <h3>Create a message</h3>
            <form onSubmit={handleMessageSubmit}>
                <ul>
                    {validationErrors.map((error) => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
                <label>Name</label>
                <input
                    placeholder={message}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></input>
                <button disabled={validationErrors.length > 0}>Create</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>


        </div>
    )
}
