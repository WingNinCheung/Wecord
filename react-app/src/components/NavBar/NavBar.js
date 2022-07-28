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
    <nav className="navbarcontainer">
      <ul className="navbarlist">
        <li className="navbarli">
          <NavLink id="splash-logo" to="/" exact={true}>
            Wecord
          </NavLink>
        </li>
        {sessionUser && (
          <>
            <li className="navbarli">
              <NavLink
                className="navlink"
                to="/home"
                exact={true}
                activeClassName="active"
              >
                Home
              </NavLink>
            </li>
            <li className="navbarli">
              <NavLink className="navlink" to="/publicservers" exact={true} activeClassName="active">
                Public Servers
              </NavLink>
            </li>
            <li className="navbarli">
              <NavLink className="navlink" to="/friends">
                Friends{" "}
              </NavLink>
            </li>
            <li className="navbarli">
              <LogoutButton />
            </li>
          </>
        )}
        {!sessionUser && (
          <div className="auth-button">
            <span>
              <LoginFormModal />
            </span>
            <span className="">
              <SignUpFormModal />
            </span>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
