import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createServer } from "../../store/servers";
import { useHistory } from "react-router-dom";

export default function CreateForm() {
  const [name, setName] = useState("");
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

  return (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        placeholder="Server Name"
        type="text"
        onChange={(e) => setName(e.target.value)}
      ></input>
      <button>Create</button>
    </form>
  );
}
