import React, { useState } from "react";
import { Modal } from "../../modal/modal";
import LoginForm from "../LoginForm";

function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button className="login-button" onClick={() => setShowModal(true)}>
        Login
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <LoginForm />
        </Modal>
      )}
    </>
  );
}

export default LoginFormModal;
