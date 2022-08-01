import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  getChannelMessagesThunk,
  createMessage,
  editMessageThunk,
  deleteMessageThunk,
} from "../../../store/messages";
import EditMessageForm from "./editMessageForm";
import EditFormModal from "../../auth/EditMessageModal";

// initialize socket variable
let socket;

export default function Chat({ channelId }) {
  //TODO: double check that this is the user
  const user = useSelector((state) => state.session.user);
  const oldMessages = useSelector((state) => state.messages);

  const dispatch = useDispatch();

  // user messages
  const [messages, setMessages] = useState([]);
  // controlled form input
  const [chatInput, setChatInput] = useState("");

  const [validationErrors, setValidationErrors] = useState([]);

  const [openEditForm, setOpenEditForm] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [messageUserId, setMessageUserId] = useState("");

  const [deleteStatus, setDeleteStatus] = useState(false);

  const loadAllMessages = async () => {
    await dispatch(getChannelMessagesThunk(channelId));
    await setMessages(Object.values(oldMessages));
  };

  useEffect(() => {
    if (deleteStatus) {
      dispatch(deleteMessageThunk(user.id, messageId));
    }
    setDeleteStatus(false);
  }, [dispatch, deleteStatus]);

  //   Run messages load here on page load:
  useEffect(() => {
    if (oldMessages) {
      loadAllMessages();
    }
  }, [socket, openEditForm]);

  // Run socket stuff (so connect/disconnect ) whenever channelId changes
  useEffect(() => {
    // create websocket/connect
    socket = io();

    socket.on("connect", () => {
      socket.emit("join", { username: user.username, channelId: channelId });
    });

    // listen for chat events (chat parameter is an event)
    socket.on("chat", (chat) => {
      // when we receive a chat, add to our messages array in state
      setMessages((messages) => [...messages, chat]);
    });

    // listen for edited messages (oldMessage is the edited one)
    socket.on("edit", (updatedMessages) => {
      // when we receive a chat, add to our messages array in state

      // trigger rerender useeffect
      setOpenEditForm(false);

      if (oldMessages.length) {
        setMessages(Object.values(oldMessages));
      }
    });

    // disconnect upon component unmount
    return () => {
      // note: I don't think leave is necessary cuz disconnect leaves all rooms but this is just for
      // logging when ppl leave for now
      socket.emit("leave", { username: user.username, channelId: channelId });
      socket.disconnect();
    };
  }, [channelId]);

  const updateChatInput = (e) => {
    setChatInput(e.target.value);
  };

  // console.log("messages are ", messages);
  // console.log("redux msg is ", oldMessages);

  const sendChat = async (e) => {
    e.preventDefault();
    // emit a message

    // last object value tells database to edit message or not
    if (chatInput !== "") {
      if (openEditForm) {
        if (messageId) {
          //need messageId or edit gets messed up
          socket.emit("edit", {
            user: user.username,
            message: chatInput,
            userId: user.id,
            channelId: channelId,
            messageId: messageId,
            messageUserId: messageUserId,
          });
        }
      } else {
        socket.emit("chat", {
          user: user.username,
          message: chatInput,
          userId: user.id,
          channelId: channelId,
        });
      }
      // we seem to be grabbing the correct info
    }
    setOpenEditForm(false);
    setChatInput("");
  };

  if (!oldMessages || !channelId || !socket) {
    return <p className="loading">Loading</p>;
  }

  return (
    <div className="container-message">
      <div className="messagesDisplay">
        {messages.map((message, i) => (
          <div key={i} className="singleMessageDisplay">
            <div className="username">
              <i className="fa-solid fa-user"></i>
              {message.user}
            </div>
            <div className="msg-body">
              <span className="message">{message.message}</span>
            </div>
            <div className="edit-del">
              <span
                onClick={() => {
                  setMessageId(message.id);
                  setOpenEditForm(true);
                  setMessageUserId(message.userId);
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </span>
              <span>
                <span
                  onClick={() => {
                    setMessageId(message.id);
                    setDeleteStatus(true);
                    setMessageUserId(message.userId);
                  }}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </span>
              </span>
            </div>
          </div>
        ))}

        <div className="message-form form">
          <div className="createMessageForm">
            {openEditForm ? (
              <EditFormModal
                messageId={messageId}
                userId={user.id}
                setShow={setOpenEditForm}
                msgUserId={messageUserId}
                chatInput={chatInput}
                updateChatInput={updateChatInput}
                sendChat={sendChat}
              />
            ) : (
              <form onSubmit={sendChat}>
                <ul>
                  {validationErrors.map((error) => (
                    <li key={error} className="error">{error}</li>
                  ))}
                </ul>
                <textarea
                  className="create-message"
                  placeholder="Write messages here"
                  value={chatInput}
                  onChange={updateChatInput}
                />
                <button
                  type="Submit"
                  disabled={chatInput.length === 0}
                  className="send-button"
                >
                  Post
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
