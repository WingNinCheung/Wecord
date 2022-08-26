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

export default function Chat({ channelId, setSelectedChannelId }) {
  //TODO: double check that this is the user
  const user = useSelector((state) => state.session.user);
  const oldMessages = useSelector((state) => state.messages);
  const messageArr = Object.values(oldMessages);

  const dispatch = useDispatch();

  // user messages
  const [messages, setMessages] = useState([]);

  // controlled form input
  const [chatInput, setChatInput] = useState("");
  let errors = [];

  const [validationErrors, setValidationErrors] = useState([]);

  const [openEditForm, setOpenEditForm] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [messageUserId, setMessageUserId] = useState("");
  const [update, setUpdate] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);

  // const loadAllMessages = async () => {
  //   await dispatch(getChannelMessagesThunk(channelId));
  //   await setMessages(Object.values(oldMessages));
  // };

  // useEffect(() => {
  //   console.log("the msg id is, ", messageId);
  //   if (deleteStatus) {
  //     dispatch(deleteMessageThunk(user.id, messageId));
  //   }
  //   setDeleteStatus(false);
  //   console.log("status", deleteStatus);

  //   dispatch(getChannelMessagesThunk(channelId));
  //   setMessages(Object.values(oldMessages));
  // }, [dispatch, deleteStatus]);

  const deleteMsg = async (id) => {
    await dispatch(deleteMessageThunk(user.id, id));

    await dispatch(getChannelMessagesThunk(channelId));
    await setMessages(Object.values(oldMessages));

    setDeleteStatus(!deleteStatus);
  };

  //   Run messages load here on page load:
  useEffect(() => {
    dispatch(getChannelMessagesThunk(channelId));

    setMessages(Object.values(oldMessages));
  }, [openEditForm, channelId, openEditForm, deleteStatus, update]);

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
      setUpdate(!update);
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
      socket.emit("leave", { username: user.username, channelId: channelId });
      socket.disconnect();
    };
  }, [channelId]);

  const updateChatInput = (e) => {
    setChatInput(e.target.value);
  };

  const sendChat = async (e) => {
    e.preventDefault();
    // emit a message

    // last object value tells database to edit message or not
    if (chatInput.trim() !== "") {
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
          setOpenEditForm(!openEditForm);
          dispatch(getChannelMessagesThunk(channelId));
          setMessages(Object.values(oldMessages));
          setUpdate(!update);
        }
      } else {
        socket.emit("chat", {
          user: user.username,
          message: chatInput,
          userId: user.id,
          channelId: channelId,
        });

        setUpdate(!update);
        console.log("just sent!");
      }
    }

    setChatInput("");
  };

  useEffect(() => {
    if (chatInput.trim().length === 0) {
      errors.push("Message cannot be empty");
    }
    setValidationErrors(errors);
  }, [chatInput]);

  if (!oldMessages || !channelId || !socket) {
    return <p className="loading"></p>;
  }

  return (
    <div className="container-message">
      <div className="messagesDisplay">
        {messageArr.map((message, i) => (
          <div key={i} className="singleMessageDisplay">
            <div className="username">
              <i className="fa-solid fa-user"></i>
              {message.user}
            </div>
            <div className="msg-body">
              <span className="message">{message.message}</span>
            </div>
            {message.userId === user.id && (
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

                  // onClick={() => {
                  //   setMessageId(message.id);
                  //   setDeleteStatus(true);
                  //   setMessageUserId(message.userId);
                  //   deleteMsg();
                  // }}
                  >
                    <i
                      onClick={
                        // setMessageId(message.id);
                        // setDeleteStatus(true);
                        // setMessageUserId(message.userId);
                        () => deleteMsg(message.id)
                      }
                      className="fa-solid fa-trash-can"
                    ></i>
                  </span>
                </span>
              </div>
            )}
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
                    <li key={error} className="error">
                      {error}
                    </li>
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
                  disabled={chatInput.trim().length === 0}
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
