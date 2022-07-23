import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createServer } from "../../store/servers";
import { useHistory } from "react-router-dom";

export default function CreateForm() {
  const [name, setName] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const sessionUser = useSelector((state) => state.session.user.id);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name,
      private: false,
      picture: null,
      master_admin: sessionUser,
    };

    const newServer = await dispatch(createServer(data));

    if (newServer) {
      history.push("/home");
    }

    setName("");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.push("/home");
  };
  useEffect(() => {
    const errors = [];

    if (!name.length) {
      errors.push("Server name cannot be empty!");
    }
    setValidationErrors(errors);
  }, [name]);

  return (
    <form onSubmit={handleSubmit}>
      <ul>
        {validationErrors.map((error) => (
          <li key={error}>error</li>
        ))}
      </ul>
      <label>Name</label>
      <input
        placeholder="Server Name"
        onChange={(e) => setName(e.target.value)}
      ></input>
      <button>Create</button>
      <button onClick={handleCancel}>Cancel</button>
    </form>
  );
}
