import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import { useSelector } from "react-redux";
import "./NavBar.css";

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
        {sessionUser &&
          <>
            <li className="navbarli">
              <NavLink className="navlink" to="/home" exact={true} activeClassName="active">
                Home
              </NavLink>
            </li>
            <li className="navbarli">
              <NavLink className="navlink" to="/users" exact={true} activeClassName="active">
                Users
              </NavLink>
            </li>
            <li className="navbarli">
              <NavLink className="navlink" to='/friends'>Friends </NavLink>
            </li>
            <li className="navbarli">
              <LogoutButton />
            </li>
          </>
        }
        {!sessionUser && (
          <>
            <li className="navbarli">
              <NavLink className="navlink" to="/login" exact={true} activeClassName="active">
                Login
              </NavLink>
            </li>
            <li className="navbarli">
              <NavLink className="navlink" to="/sign-up" exact={true} activeClassName="active">
                Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
