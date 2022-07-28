import React, { useState } from "react";
import { Modal } from "../../modal/modal";
import LoginForm from "../LoginForm";
import SignUpForm from "../SignUpForm";

function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Login</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <LoginForm />
        </Modal>
      )}
    </>
  );
}

export default LoginFormModal;
