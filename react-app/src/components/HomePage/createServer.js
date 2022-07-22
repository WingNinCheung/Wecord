import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createServer } from "../../store/servers";

export default function CreateForm() {
  const [name, setName] = useState("");
  const sessionUser = useSelector((state) => state.session.user.id);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(name, sessionUser);
    const data = {
      name,
      private: false,
      master_admin: sessionUser,
    };

    await dispatch(createServer(data));
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
