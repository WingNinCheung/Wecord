import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createServer } from "../../store/servers";
import { useHistory } from "react-router-dom";
import './createServer.css'

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
    <div className="createServerPage">

      <div className="form">
        <h3 className="Title">Create a server</h3>
        <form onSubmit={handleSubmit} className='create-form'>
          <ul className='Err'>
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
          <input
            placeholder="Server Name"
            onChange={(e) => setName(e.target.value)}
            className="inputarea"
          ></input>
          <button className='createButton'>Create</button>
          <button  className='createButton' onClick={handleCancel}>Cancel</button>
        </form>

      </div>

    </div>)

}
