import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createChannel } from "../../../store/channel";
import { getServerChannelsThunk } from "../../../store/channel";
import { useLocation } from "react-router-dom";

export default function CreateChannel({ props }) {
  const [title, setTitle] = useState("");
  const [hidden, setHidden] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);
  const sessionUser = useSelector((state) => state.session.user.id);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      serverId: props.serverId,
    };

    const newChannel = await dispatch(createChannel(data, props.serverId));
    await props.loadChannel();
    setTitle("");
    setHidden(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setHidden(true);
    history.push("/home");
  };
  useEffect(() => {
    const errors = [];

    if (!title.length) {
      errors.push("Channel name cannot be empty!");
    }
    setValidationErrors(errors);
  }, [title]);

  return (
    <>
      <button
        onClick={() => {
          setHidden(false);
        }}
      >
        Create a Channel
      </button>
      <form hidden={hidden} onSubmit={handleSubmit}>
        <ul>
          {validationErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
        <label>Title</label>
        <input
          placeholder="Channel Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        ></input>
        <button>Create</button>
        <button onClick={handleCancel}>Cancel</button>
      </form>
    </>
  );
}
