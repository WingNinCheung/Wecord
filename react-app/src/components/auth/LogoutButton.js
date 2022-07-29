import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import "./LogoutButton.css"

const LogoutButton = () => {
  const dispatch = useDispatch();
  const onLogout = async (e) => {
    await dispatch(logout());
  };

<<<<<<< HEAD
  return <button className="logoutBtn" onClick={onLogout}>Logout</button>;
=======
  return (
    <button className="login-button" onClick={onLogout}>
      Logout
    </button>
  );
>>>>>>> main
};

export default LogoutButton;
