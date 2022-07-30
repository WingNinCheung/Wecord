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
      {!sessionUser && (
        <>
          <NavLink id="splash-logo" to="/" exact={true}>
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

      {sessionUser && (
        <nav className="navbarcontainer">
          <span className="navbarli">
            <NavLink
              id="splash-logo"
              to="/"
              exact={true}
            >
              Wecord
            </NavLink>
          </span>
          <span className="navbarli">
            <NavLink
              className="navlink navlink1"
              to="/home"
              exact={true}
              activeClassName="active"
            >
              Home
            </NavLink>
          </span>
          <span className="navbarli">
            <NavLink
              className="navlink navlink1"
              to="/publicservers"
              exact={true}
              activeClassName="active"
            >
              Public Servers
            </NavLink>
          </span>
          <span className="navbarli">
            <NavLink id="splash-nav" className="navlink" to="/friends">
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
