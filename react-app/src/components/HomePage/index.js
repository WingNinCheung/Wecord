import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllServers, updateServer } from "../../store/servers";

import "./HomePage.css";

function HomePage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const loggedInUserId = sessionUser.id;
  const allServers = useSelector((state) => state.servers);

  const allServersArray = Object.values(allServers);

  const publicServers = allServersArray.filter(
    (server) => server.private === false
  );

  const privateServers = allServersArray.filter(
    (server) =>
      server.private === true && server.master_admin === sessionUser.id
  );

  useEffect(() => {
    dispatch(getAllServers());
  }, [dispatch]);

  // edit server form - may use modal to refactor it
  const [name, setName] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [mainServer, setMainServer] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState(1);
  const [adminId, setAdminId] = useState(1);
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState({ x: 0, y: 0 });
  const [edit, setEdit] = useState(false);

  const history = useHistory();

  // Right click menu
  const Menu = ({ x, y }) => {
    return (
      <div
        style={{
          borderRadius: "4px",
          padding: "10px",
          border: "1px solid black",
          boxSizing: "border-box",
          width: "200px",
          position: "absolute",
          top: `${x}px`,
          left: `${y}px`,
        }}
      >
        <div>
          <button
            onClick={() => {
              setEdit(true);
            }}
            disabled={loggedInUserId !== adminId}
          >
            Edit
          </button>
        </div>
        <div>
          <button>Delete</button>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
    };
    await dispatch(updateServer(payload, selectedServerId));
    setName("");
    setMainServer(false);
    setShow(false);
    setEdit(false);
    history.push("/home");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEdit(false);
    history.push("/home");
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShow(true);
  };

  // left click anywhere will make the right-click menu disappear
  useEffect(() => {
    const handleClick = () => setShow(false);
    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const errors = [];

    if (!name.length) {
      errors.push("Server name cannot be empty!");
    }
    setValidationErrors(errors);
  }, [name]);

  return (
    <div className="outContainer">
      <NavLink to="/create-server">Add a Server</NavLink>
      <div></div>
      {/* <NavLink to="/update-server">Edit a Server</NavLink> */}

      <div className="publicServers">
        <h3>Public</h3>
        <ul>
          {publicServers &&
            publicServers.map((server) => (
              <div
                key={server.id}
                onContextMenu={(e) => {
                  handleContextMenu(e);
                  setSelectedServerId(server.id);
                  setAdminId(server.master_admin);
                  setLocation({ x: e.pageX, y: e.pageY });
                  setName(server.name);
                  setEdit(false);
                }}
              >
                <li key={server.id}>
                  <button onClick={() => {}}>{server.name}</button>
                </li>
              </div>
            ))}
          {show && <Menu x={location.y} y={location.x} />}
        </ul>
      </div>

      <div>----------------</div>
      <div className="privateServers">
        <h3>Private</h3>
        <ul>
          {privateServers &&
            privateServers.map((server) => (
              <li key={server.id}>
                <button
                  onClick={() => {
                    setMainServer(true);
                    setSelectedServerId(server.id);
                    setName(server.name);
                  }}
                >
                  {server.name}
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div>------------------------</div>
      <div>
        {edit && (
          <div>
            <h3>Update Yout Server Here!</h3>
            <form onSubmit={handleSubmit}>
              <ul>
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
              <label>Name</label>
              <input
                placeholder={name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
              <button disabled={!!validationErrors.length}>Edit</button>
              <button onClick={handleCancel}>Cancel</button>
            </form>
          </div>
        )}
      </div>
      <div className="channels"></div>
      <div className="messages"></div>
      <div className="userLists"></div>
    </div>
  );
}

export default HomePage;
