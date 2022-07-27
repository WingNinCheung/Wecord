import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function Member({ serverId }) {
  const serverUsers = useSelector((state) => state.serverUsers);

  if (!serverId) return <p>"Loading users"</p>;

  return (
    <ul>
      {serverUsers &&
        Object.values(serverUsers).map((ele) => (
          <li key={ele.user.id}><NavLink to={`/users/${ele.user.id}`}>
            {ele.user.username}</NavLink></li>

        ))
      }
    </ul >
  );
}
