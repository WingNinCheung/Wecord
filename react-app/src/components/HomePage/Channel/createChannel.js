import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { createChannel } from "../../../store/channel";

export default function CreateChannel() {
  const [title, setTitle] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const sessionUser = useSelector((state) => state.session.user.id);
  const dispatch = useDispatch();
  const history = useHistory();

  const { serverId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      serverId,
    };

    const newChannel = await dispatch(createChannel(data, serverId));

    if (newChannel) {
      history.push("/home");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.push("/home");
  };
  useEffect(() => {
    const errors = [];

    if (!title.length) {
      errors.push("Server name cannot be empty!");
    }
    setValidationErrors(errors);
  }, [title]);

  return (
    <form onSubmit={handleSubmit}>
      <ul>
        {validationErrors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <label>Title</label>
      <input
        placeholder="Channel Title"
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <button>Create</button>
      <button onClick={handleCancel}>Cancel</button>
    </form>
  );
}
