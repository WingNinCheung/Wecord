import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllServers, updateServer, deleteServer } from "../../store/servers";
import { getAllServerUsers, addServerUser, leaveServer } from "../../store/serverUsers";
import { getServerChannelsThunk } from "../../store/channel";
import { getChannelMessagesThunk } from "../../store/messages";
import "./HomePage.css";

function HomePage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  // READ ALL PUBLIC AND PRIVATE SERVERS -------- working
  const allServers = useSelector((state) => state.servers);
  const allServersArray = Object.values(allServers);
  const loggedInUserId = sessionUser.id;
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

  // EDIT SERVER - may use modal to refactor it  ------working
  const [name, setName] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [mainServer, setMainServer] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState(1);
  const [adminId, setAdminId] = useState();
  const [goToChannel, setGoToChannels] = useState(false);
  const [openChannels, setOpenChannels] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState(1);
  const [showChannelMessages, setShowChannelMessages] = useState(false);
  const [goToChannelMessages, setGoToChannelsMessages] = useState(false);
  const history = useHistory();

  // right-click menu section
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState({ x: 0, y: 0 });
  const [edit, setEdit] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteServer(selectedServerId));
    await dispatch(getAllServers());
  };

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
          backgroundColor: "gray",
        }}
      >
        <div>
          <button
            onClick={() => {
              setEdit(true);
            }}
            disabled={loggedInUserId !== adminId}
          >
            Edit Name
          </button>
        </div>
        <div>
          <button onClick={handleDelete} disabled={loggedInUserId !== adminId}>
            Delete
          </button>
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
  // const handleUserClick = (e) => {
  //     e.preventDefault();
  //     setAdminId(server.master_admin)
  //     console.log(adminId)

  // }

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

  // -------------------------------------------------

  // Read all channels of a server  ------ working
  const loadChannel = async () => {
    // if (goToChannel) {
    // check if user is a member of this server already
    let serverUsers = await dispatch(getAllServerUsers(selectedServerId))
    serverUsers = serverUsers.server_users

    let userInServer = false

    serverUsers.forEach(su => {
      if (su.userId == loggedInUserId) {

        userInServer = true
      }
    })

    if (userInServer) {
      dispatch(getServerChannelsThunk(selectedServerId));
      setOpenChannels(true)
    }

    else {

      // dispatch(getServerChannelsThunk(0));
      setOpenChannels(false)
      setGoToChannels(false);
      setShowChannelMessages(false)
      // }
    }
    setGoToChannels(false);
  };

  useEffect(() => {
    console.log("Entered loadChannel useEffect");
    loadChannel();
  }, [dispatch, goToChannel]);

  const allChannels = useSelector((state) => state.channel);
  const serverChannels = Object.values(allChannels);
  console.log(serverChannels)

  //----------------------------------------------------

  // READ ALL MESSAGES OF A SINGLE CHANNEL
  const channelMessages = useSelector((state) => state.messages);
  const channelMessagesArr = Object.values(channelMessages);

  const LoadChannelMessages = async () => {
    if (goToChannelMessages) {
      const result = await dispatch(getChannelMessagesThunk(selectedChannelId));
      setGoToChannelsMessages(false);
    }
  };

  useEffect(() => {
    LoadChannelMessages();
  }, [dispatch, goToChannelMessages]);

  // ------------------------------------------------

  return (
    <div>
      <div className="addServerLinkContainer">
        <NavLink className="addServerLinkContainer" to="/create-server">
          Add a Server
        </NavLink>
      </div>
      <div className="outContainer">
        <div className="publicServers">
          <h3>Public</h3>
          <ul className="publicServersDisplay">
            {publicServers &&
              publicServers.map((server) => (
                <div
                  key={server.id}
                  onContextMenu={(e) => {
                    handleContextMenu(e);
                    setSelectedServerId(server.id);
                    setAdminId(server.master_admin);
                    setEdit(false);
                    setName(server.name);
                    setLocation({ x: e.pageX, y: e.pageY });
                  }}
                >
                  <li>
                    <button
                      className="singleServerDisplay"
                      onClick={() => {
                        setMainServer(true);
                        setSelectedServerId(server.id);
                        setAdminId(server.master_admin);
                        setOpenChannels(true);
                        setGoToChannels(true);
                        setGoToChannelsMessages(false);
                        setShowChannelMessages(false);
                      }}
                    >
                      {server.name}
                    </button>
                  </li>
                </div>
              ))}
            {show && <Menu x={location.y} y={location.x} />}
          </ul>
          {/* <ul>
                    {publicServers &&
                        publicServers.map((server) => (
                            <li key={server.id}>
                                <button onClick={handleUserClick}>{server.name}</button>
                            </li>
                        ))}
                </ul> */}
        </div>

        <div className="privateServers">
          <h3>Private</h3>
          <ul className="privateServersDisplay">
            {privateServers &&
              privateServers.map((server) => (
                <li key={server.id}>
                  <button
                    className="singleServerDisplay"
                    onClick={() => {
                      setMainServer(true);
                      setSelectedServerId(server.id);
                      setName(server.name);
                      setOpenChannels(true);
                      setGoToChannels(true);
                      setShowChannelMessages(false);
                    }}
                  >
                    {server.name}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="serverChannels">
          <h3>Channels</h3>
          {openChannels ? (
            <div>
              <ul className="channelsDisplay">
                {serverChannels.length &&
                  serverChannels.map((channel) => (
                    // <li key={channel.id}>
                    //     <button onClick={handleChannelClick}>{channel.title}</button>
                    // </li>
                    <li key={channel.id}>
                      <div>
                        <i className="fa-solid fa-hashtag"></i>
                      </div>
                      <button
                        className="singleChannelDisplay"
                        onClick={() => {
                          setSelectedChannelId(channel.id);
                          setShowChannelMessages(true);
                          setGoToChannelsMessages(true);
                        }}
                      >
                        {channel.title}
                      </button>
                    </li>
                  ))}
              </ul>
              <button onClick={async (e) => {
                e.preventDefault()
                await dispatch(leaveServer(loggedInUserId, selectedServerId))
                await loadChannel()
              }}>Leave Server</button>
            </div>
          ) : (
            <div>
              <button className="join-now button" onClick={async (e) => {
                // Button to join a server if user is not in server
                e.preventDefault()
                await dispatch(addServerUser(loggedInUserId, selectedServerId))
                await loadChannel()
              }}>
                Join Server
              </button>
            </div>
          )}
        </div>

        <div className="messagesContainer">
          <h3>messages</h3>
          {showChannelMessages ? (
            <div>
              <ul className="messagesDisplay">
                {channelMessagesArr &&
                  channelMessagesArr.map((message) => (
                    <li key={message.id}>
                      <button className="singleMessageDisplay">
                        {message.message}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div> </div>
          )}
        </div>

        <div className="userLists"></div>
      </div>

      <div className="updateServerForm">
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
              <button disabled={validationErrors.length > 0}>Edit</button>
              <button onClick={handleCancel}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
