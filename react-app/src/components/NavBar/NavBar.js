import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import { useSelector } from "react-redux";
import "./NavBar.css";
import LoginFormModal from "../auth/LoginFormModal";
import SignUpFormModal from "../auth/SignupFormModal";

const NavBar = () => {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <>
      <div className="splash-nav">
        {!sessionUser && (
          <>
            <NavLink id="splash-logo" className="wecord" to="/" exact={true}>
              Wecord
            </NavLink>
            <div className="auth-button">
              <span>
                <LoginFormModal />
              </span>
              <span className="">
                <SignUpFormModal />
              </span>
            </div>
          </>
        )}
      </div>

      {sessionUser && (
        <nav className="navbarcontainer">
          <span className="navbarli">
            <NavLink
              id="splash-logo"
              className="wecord"
              to="/home"
              exact={true}
            >
              Wecord
            </NavLink>
          </span>
          <span className="navbarli">
            <NavLink id="splash-nav" to="/home" exact={true}>
              Home
            </NavLink>
          </span>
          <span className="navbarli">
            <NavLink id="splash-nav" to="/users" exact={true}>
              Users
            </NavLink>
          </span>
          <span className="navbarli">
            <NavLink id="splash-nav" to="/friends">
              Friends{" "}
            </NavLink>
          </span>
          <span className="navbarli">
            <LogoutButton />
          </span>
        </nav>
      )}
    </>
  );
};

export default NavBar;
