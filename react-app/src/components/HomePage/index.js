import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../store/user";
import { getAllServers, updateServer, deleteServer } from "../../store/servers";
import {
  getServerChannelsThunk,
  deleteChannelThunk,
} from "../../store/channel";
import {
  getChannelMessagesThunk,
  deleteMessageThunk,
} from "../../store/messages";

import CreateChannel from "./Channel/createChannel";
import EditChannel from "./Channel/editChannel";
import CreateMessageForm from "./createMessageForm";
import EditMessageForm from "./editMessageForm";

import {
  getAllServerUsers,
  addServerUser,
  leaveServer,
} from "../../store/serverUser";
import Member from "../../components/HomePage/member";

import "./HomePage.css";
import "./message.css";

function HomePage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const loggedInUserId = sessionUser.id;

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // READ ALL PUBLIC AND PRIVATE SERVERS -------- working
  const allServers = useSelector((state) => state.servers);
  let allServersArray;
  if (allServers.allServers) allServersArray = Object.values(allServers.allServers);
  let publicServers
  if (allServersArray) {
    publicServers = allServersArray.filter(
      (server) => server.private === false
    );
  }
  let defaultSelectedServerId
  if (publicServers) {
    defaultSelectedServerId = publicServers[0];
    if (defaultSelectedServerId) {
      defaultSelectedServerId = defaultSelectedServerId.id;
    }
  }

  let privateServers
  if (allServers.yourServers) {
    privateServers = allServers.yourServers.filter(
      (server) => {
        if (server.private === true) return server
      }
    );
  }
  useEffect(() => {
    dispatch(getAllServers(loggedInUserId));
  }, [dispatch]);

  // EDIT SERVER - may use modal to refactor it  ------working
  const [name, setName] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [mainServer, setMainServer] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState(
    defaultSelectedServerId
  );
  const [adminId, setAdminId] = useState();
  const [goToChannel, setGoToChannels] = useState(false);
  const [openChannels, setOpenChannels] = useState(true);
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [showChannelMessages, setShowChannelMessages] = useState(false);
  const [goToChannelMessages, setGoToChannelsMessages] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [userIsInServer, setUserIsInServer] = useState(false);
  const history = useHistory();

  // right-click menu section
  const [show, setShow] = useState(false);
  const [channelShow, setChannelShow] = useState(false);
  const [location, setLocation] = useState({ x: 0, y: 0 });

  // the server edit
  const [edit, setEdit] = useState(false);
  const [editChannel, setEditChannel] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteChannelThunk(selectedServerId, selectedChannelId));
    await loadChannel();
    setShowChannelMessages(false);
  };
  const handleDeleteServer = async (e) => {
    e.preventDefault();
    await dispatch(deleteServer(selectedServerId, loggedInUserId));
    await dispatch(getAllServers());


    setGoToChannels(false);
    setGoToChannelsMessages(false);
    setShowChannelMessages(false);
    setUserIsInServer(false);
    setSelectedServerId("");
    setOpenChannels(false);
    checkUserinServer(selectedServerId);
  };

  const checkUserinServer = async (serverId) => {
    const data = await dispatch(getAllServerUsers(serverId));
    let userInServer = false;

    for (let i of data) {
      if (i.user.id == loggedInUserId) {
        userInServer = true;
      }
    }

    if (userInServer) {
      setOpenChannels(true);
      setGoToChannels(true);
      setGoToChannelsMessages(false);
      setShowChannelMessages(false);
      setUserIsInServer(true);
      return true;
    } else {
      setOpenChannels(false);
      setGoToChannels(false);
      setGoToChannelsMessages(false);
      setShowChannelMessages(false);
      setUserIsInServer(false);

      return false;
    }
  };

  // Right click server menu
  const Menu = ({ x, y }) => {
    return (
      <div
        style={{
          borderRadius: "4px",
          padding: "10px",
          border: "1px solid black",
          boxSizing: "border-box",
          width: "122px",
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
              setEditChannel(false);
            }}
            disabled={loggedInUserId !== adminId}
            className="editServerBtn2"
          >
            Edit Server
          </button>
        </div>
        <div>
          <button
            onClick={handleDeleteServer}
            disabled={loggedInUserId !== adminId}
            className="editServerBtn2"
          >
            Delete
          </button>
        </div>
        <div>
          <button
            onClick={handleLeave}
            disabled={!userIsInServer || loggedInUserId == adminId}
            className="editServerBtn2"
          >
            Leave Server
          </button>
        </div>
      </div>
    );
  };

  const ChannelMenu = ({ x, y }) => {
    return (
      <div
        style={{
          borderRadius: "4px",
          padding: "10px",
          border: "1px solid black",
          boxSizing: "border-box",
          width: "122px",
          position: "absolute",
          top: `${x}px`,
          left: `${y}px`,
          backgroundColor: "gray",
        }}
      >
        <div>
          <button
            onClick={() => {
              setEditChannel(true);
              setEdit(false);
            }}
            disabled={loggedInUserId !== adminId}
            className="editServerBtn2"
          >
            Edit Channel
          </button>
        </div>
        <div>
          <button onClick={handleDelete} disabled={loggedInUserId !== adminId} className="editServerBtn2">
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
    setChannelShow(false);
  };

  const handleContextMenuChannel = (e) => {
    e.preventDefault();
    setChannelShow(true);
    setShow(false);
  };

  // left click anywhere will make the right-click menu disappear
  useEffect(() => {
    const handleClick = () => {
      setShow(false);
      setChannelShow(false);
    };

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
    const result = await dispatch(getServerChannelsThunk(selectedServerId));
    setGoToChannels(false);
  };

  useEffect(() => {
    if (defaultSelectedServerId) loadChannel();
  }, [dispatch, goToChannel]);

  const allChannels = useSelector((state) => state.channel);
  const serverChannels = Object.values(allChannels);

  //----------------------------------------------------

  // READ ALL MESSAGES OF A SINGLE CHANNEL
  const channelMessages = useSelector((state) => state.messages);
  const channelMessagesArr = Object.values(channelMessages);

  const allUsers = useSelector((state) => state.users);
  const allUserArr = Object.values(allUsers);

  for (let i = 0; i < channelMessagesArr.length; i++) {
    for (let j = 0; j < allUserArr.length; j++) {
      if (channelMessagesArr[i].userId == allUserArr[j].id)
        channelMessagesArr[i]["username"] = allUserArr[j].username;
    }
  }

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

  // Edit a message

  const [openEditForm, setOpenEditForm] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [messageUserId, setMessageUserId] = useState("");

  // Delete a message

  const [deleteStatus, setDeleteStatus] = useState(false);

  useEffect(() => {
    if (deleteStatus) {
      dispatch(deleteMessageThunk(loggedInUserId, messageId)).then(() =>
        dispatch(getChannelMessagesThunk(selectedChannelId))
      );
    }
    setDeleteStatus(false);
    history.push("/home");
  }, [dispatch, deleteStatus]);

  const handleJoin = async (e) => {
    e.preventDefault();
    await dispatch(addServerUser(loggedInUserId, selectedServerId));
    checkUserinServer(selectedServerId);
  };

  const handleLeave = async (e) => {
    e.preventDefault();
    await dispatch(leaveServer(loggedInUserId, selectedServerId));
    checkUserinServer(selectedServerId);
  };

  // create a channel

  return (
    <div>
      <div className="addServerLinkContainer">
        <NavLink className="addServerLinkContainer addServerLink" to="/create-server" >
          Add a Server
        </NavLink>
      </div>
      <div className="updateServerForm">
        {edit && (
          <div>
            <div className="updateTitle">
              <h3>Update Your Server Here!</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <ul>
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
              <input
                placeholder={name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="inputUpdateServer"
              ></input>
              <button disabled={validationErrors.length > 0} className="editBtn">Edit</button>
              <button onClick={handleCancel} className="editBtn">Cancel</button>
            </form>
          </div>
        )}
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
                        checkUserinServer(server.id);
                      }}
                    >
                      {server.name}
                    </button>
                  </li>
                </div>
              ))}
            {show && <Menu x={location.y} y={location.x} />}
          </ul>
        </div>

        <div className="privateServers">
          <h3>Private</h3>
          <div className="serverContainer">
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
                        checkUserinServer(server.id);
                      }}
                    >
                      {server.name}
                    </button>
                  </li>
                ))}
            </ul>

          </div>

        </div>

        <div className="serverChannels">
          <h3>Channels</h3>
          {adminId === loggedInUserId && selectedServerId && (
            <CreateChannel
              props={{ serverId: selectedServerId, loadChannel }}
            />
          )}
          {openChannels ? (
            <div>
              <ul className="channelsDisplay" >
                {serverChannels &&
                  serverChannels.map((channel) => (
                    <div
                      key={channel.id}
                      onContextMenu={(e) => {
                        handleContextMenuChannel(e);
                        setLocation({ x: e.pageX, y: e.pageY });
                        setSelectedChannelId(channel.id);
                        setChannelName(channel.title);
                      }}

                    >
                      <li key={channel.id} value={channel.serverId}>
                        <span>
                          {/* <i className="fa-solid fa-hashtag"></i> */}
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
                        </span>
                      </li>
                    </div>
                  ))}
                {channelShow && <ChannelMenu x={location.y} y={location.x} />}
              </ul>
            </div>
          ) : selectedServerId ? (
            <div>
              <button onClick={handleJoin} className="joinServerBtn">Join Server</button>
            </div>
          ) : (
            <div></div>
          )}

          {editChannel && (
            <EditChannel
              serverId={selectedServerId}
              channelId={selectedChannelId}
              setEdit={setEditChannel}
              channelTitle={channelName}
              loadChannel={loadChannel}
            />
          )}
        </div>

        <div className="messagesContainer">
          {/* <h3>Messages</h3> */}

          {showChannelMessages ? (
            <div>
              <div className="container-message">
                <div className="messagesDisplay">
                  {channelMessagesArr &&
                    channelMessagesArr.map((message) => (
                      <div key={message.id} className="singleMessageDisplay">
                        <div className="username">
                          <i className="fa-solid fa-user"></i>
                          {message.username}
                        </div>
                        <div className="msg-body">
                          <span className="message">{message.message}</span>

                          <span
                            onClick={() => {
                              setMessageId(message.id);
                              setOpenEditForm(true);
                              setMessageUserId(message.userId);
                            }}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </span>
                          <span
                            onClick={() => {
                              setMessageId(message.id);
                              setDeleteStatus(true);
                              setMessageUserId(message.userId);
                            }}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <CreateMessageForm
                  channelId={selectedChannelId}
                  userId={sessionUser.id}
                  getMessages={getChannelMessagesThunk}
                />
              </div>

              {openEditForm && (
                <EditMessageForm
                  messageId={messageId}
                  userId={sessionUser.id}
                  setShow={setOpenEditForm}
                  msgUserId={messageUserId}
                />
              )}
            </div>
          ) : (
            <div className="noMsg">"No messages"</div>
          )}
        </div>

        <div className="userLists">
          <h3>Members</h3>
          <Member serverId={selectedServerId} />
        </div>
      </div>

      {/* <div className="updateServerForm">
        {edit && (
          <div>
            <h3>Update Your Server Here!</h3>
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
      </div> */}
    </div>
  );
}

export default HomePage;
