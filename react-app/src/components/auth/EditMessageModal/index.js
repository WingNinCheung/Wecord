import React, { useState } from "react";
import { Modal } from "../../modal/modal";
import EditMessageForm from "../../HomePage/Chat/editMessageForm";

function EditFormModal({
  messageId,
  userId,
  setShow,
  msgUserId,
  chatInput,
  updateChatInput,
  sendChat,
}) {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      {/* <button className="login-button" onClick={() => setShowModal(true)}>
        Edit
      </button> */}
      {1 && (
        <Modal onClose={() => setShowModal(false)}>
          <EditMessageForm
            messageId={messageId}
            userId={userId}
            setShow={setShow}
            msgUserId={msgUserId}
            chatInput={chatInput}
            updateChatInput={updateChatInput}
            sendChat={sendChat}
            setShowModal={setShowModal}
          />
        </Modal>
      )}
    </>
  );
}

export default EditFormModal;
