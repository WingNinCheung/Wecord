import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";
import { useSelector } from "react-redux";

const NavBar = () => {
  const sessionUser = useSelector((state) => state.session.user);
  console.log(sessionUser);
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/home" exact={true} activeClassName="active">
            Home
          </NavLink>
        </li>

        {!sessionUser && (
          <>
            <li>
              <NavLink to="/login" exact={true} activeClassName="active">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/sign-up" exact={true} activeClassName="active">
                Sign Up
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink to="/users" exact={true} activeClassName="active">
            Users
          </NavLink>
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
