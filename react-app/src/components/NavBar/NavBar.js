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
            <NavLink
              id="splash-logo"
              className="navbarli"
              to="/"
              exact={true}
            >
              Wecord
            </NavLink>
            <NavLink
              className="navlink navlink1 navbarli"
              activeClassName="active"
              to="/home"
              exact={true}
            >
              Home
            </NavLink>
            <NavLink
              className="navlink navlink1 navbarli"
              activeClassName="active"
              to="/publicservers"
              exact={true}
            >
              Discover
            </NavLink>
            <NavLink
              id="splash-nav"
              className="navlink navbarli"
              activeClassName="active"
              to="/friends">
              My Friends{" "}
            </NavLink>
          <span className="navbarli">
            <LogoutButton />
          </span>
        </nav>
      )}
    </>
  );
};

export default NavBar;
