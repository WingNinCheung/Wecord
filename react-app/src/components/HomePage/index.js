import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllServers, updateServer, deleteServer } from "../../store/servers";
import { getServerChannelsThunk, deleteChannelThunk } from "../../store/channel";
import { getChannelMessagesThunk } from "../../store/messages";

import EditChannel from "./Channel/editChannel";
import { CreateMessageForm, EditMessageForm } from "./Forms/messages";
import CreateChannel from "./Channel/createChannel";

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
  const [selectedServerId, setSelectedServerId] = useState("");
  const [adminId, setAdminId] = useState();

  const [goToChannel, setGoToChannels] = useState(false);
  const [openChannels, setOpenChannels] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [channelName, setChannelName] = useState("");

  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [showMessageDropdown, setShowMessageDropdown] = useState(false);
  const [showChannelMessages, setShowChannelMessages] = useState(false);
  const [goToChannelMessages, setGoToChannelsMessages] = useState(false);
  const [editMode, setEditMode] = useState(false); // for individual message

  // function to open messsage edit button menu
  const openMessageMenu = () => {
    if (showMessageDropdown) return;
    setShowMessageDropdown(true);
  }

  // useEffect to close message edit button menu
  useEffect(() => {
    if (!showMessageDropdown) return;

    const closeMessageMenu = () => {
      setShowMessageDropdown(false);
    }

    document.addEventListener('click', closeMessageMenu);

    return () => document.removeEventListener("click", closeMessageMenu);
  }, [showMessageDropdown]);

  // useEffect to set edit mode for messages
  // NOTE: this may not work loll test it
  useEffect(() => {
    if (!editMode) return

    const cancelEdit = () => {
      setEditMode(false);
    }

    document.addEventListener('click', cancelEdit);

    return () => document.removeEventListener("click", cancelEdit);
  }, [editMode])

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
    await dispatch(deleteServer(selectedServerId));
    await dispatch(getAllServers());
  };

  const handleChannelDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteChannelThunk(selectedServerId, selectedChannelId))

  }

  console.log("show is", show);
  console.log("channelShow is ", channelShow);

  // Right click server menu
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
              setEditChannel(false);
            }}
            disabled={loggedInUserId !== adminId}
          >
            Edit Server
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

  const ChannelMenu = ({ x, y }) => {
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
              setEditChannel(true);
              setEdit(false);
            }}
            disabled={loggedInUserId !== adminId}
          >
            Edit Channel
          </button>
        </div>
        <div>
          <button onClick={handleChannelDelete} disabled={loggedInUserId !== adminId}>
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
    if (goToChannel) {
      const result = await dispatch(getServerChannelsThunk(selectedServerId));
      console.log("result:", result);
      setGoToChannels(false);
    }
  };

  useEffect(() => {
    loadChannel();
  }, [dispatch, goToChannel]);

  const allChannels = useSelector((state) => state.channel);
  const serverChannels = Object.values(allChannels);
  console.log("serverChannels:", serverChannels);

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
          {adminId === loggedInUserId && selectedServerId && (
            <NavLink to={`/${selectedServerId}/channels/create`}>
              create a channel
            </NavLink>
          )}
          {openChannels ? (
            <div>
              <ul className="channelsDisplay">
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
                    </div>
                  ))}
                {channelShow && <ChannelMenu x={location.y} y={location.x} />}
              </ul>
            </div>
          ) : (
            <div> </div>
          )}

          {editChannel && (
            <EditChannel
              serverId={selectedServerId}
              channelId={selectedChannelId}
              setEdit={setEditChannel}
              channelTitle={channelName}
            />
          )}
        </div>

        <div className="messagesContainer">
          <h3>messages</h3>
          {showChannelMessages ? (
            <div>
              <div className="messagesDisplay">
                  {channelMessagesArr &&
                    channelMessagesArr.map((message) => (
                      <div key={message.id} id={message.id} className="singleMessageDisplay">
                        { !editMode ?
                          <p>{message.message}</p>
                          :
                          <EditMessageForm channelId={selectedChannelId} userId={sessionUser.id} getMessages={getChannelMessagesThunk} messageId={message.id} message={message.message} />
                        }
                          <button onClick={openMessageMenu}>
                            <i className="fa-light fa-ellipsis"></i>
                          </button>
                          {showMessageDropdown && (
                            <ul className="message-dropdown">
                              <li onClick={setEdit(true)}>Edit Message</li>
                              <li>Delete Message</li>
                            </ul>
                          )}
                      </div>
                    ))}
              </div>

              <CreateMessageForm channelId={selectedChannelId} userId={sessionUser.id} getMessages={getChannelMessagesThunk}/>

            </div>
          ) : (
            <div>"No messages"</div>
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
