import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, getChannelMessagesThunk} from "../../store/messages";
import { editMessageThunk } from "../../store/messages";
import { useHistory } from "react-router-dom";

export default function EditMessageForm({ messageId, userId, setShow, msgUserId }) {




    const [validationErrors, setValidationErrors] = useState([]);
    const [editMessage, setEditMessage] = useState("")

    const dispatch = useDispatch();
    const history = useHistory();

    const handleEditMessageSubmit = async (e) => {
        e.preventDefault();

        const data = {
            message:editMessage
        };

        await dispatch(editMessageThunk(userId, messageId, data));
        setEditMessage("")

    }

    const handleCancel = (e) => {
        e.preventDefault();
        setShow(false)
        history.push("/home");
      };


    useEffect(() => {
        const errors = [];

        if(msgUserId !== userId){
            errors.push("only people who created it can delete message")
        }

        if (!editMessage.length) {
            errors.push("Message cannot be empty!");
        }
        setValidationErrors(errors);
    }, [editMessage]);

    // if (!userId) return <p className="loading">"Loading..."</p>

    return (
        <div className="editMessageForm">
            <h3>Edit a message</h3>
            <form onSubmit={handleEditMessageSubmit}>
                <ul>
                    {validationErrors.map((error) => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
                <textarea
                    className="edit-message"
                    placeholder="Edit message here"
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                ></textarea>
                <button disabled={validationErrors.length > 0}>Update</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>


        </div>

    )
}
