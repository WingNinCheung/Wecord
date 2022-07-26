import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function DisplayServerUsers({ serverId }) {

    const serverUsers = useSelector(state => state.serverUsers.server_users)

    if (serverUsers) {
        console.log("SERVER USERS displayServerUserse component: ", serverUsers.server_users)
    }

    if (!serverId) return <p>"Loading users"</p>
  return (
    <div>
        { serverId &&
        <ul>
            {serverUsers && Object.values(serverUsers).map(user => {
                <li key = {user.userId}>
                    {user}
                </li>

            })}
        </ul>
        }
    </div>
  )
}
