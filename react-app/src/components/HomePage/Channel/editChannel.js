import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { updateChannel } from "../../../store/channel";

export default function EditChannel({
  serverId,
  channelId,
  setEdit,
  channelTitle,
  loadChannel,
}) {
  const [title, setTitle] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  // const [hidden, setHidden] = useState(true);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const errors = [];

    if (!title.length) {
      errors.push("Title cannot be empty");
    }
    setValidationErrors(errors);
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      serverId,
      title,
    };

    const newChannel = await dispatch(updateChannel(data, serverId, channelId));
    await loadChannel();
    setEdit(false);
    // history.push("/home");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEdit(false);
    history.push("/home");
  };

  return (
    <div>
      <h3>Update Your Channel Here!</h3>
      <form className="create-form" onSubmit={handleSubmit}>
        <ul>
          {validationErrors.map((error) => (
            <li key={error} className="error">{error}</li>
          ))}
        </ul>
        <label>Title</label>
        <input
          placeholder={channelTitle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <button className="edit-channel" disabled={validationErrors.length > 0}>
          Edit channel
        </button>
        <button className="edit-channel" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
