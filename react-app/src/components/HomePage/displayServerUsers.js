import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function DisplayServerUsers({ serverId }) {

    const serverUsers = useSelector(state => state.serverUsers)

    if (serverUsers) {
        console.log("SERVER USERS displayServerUserse component: ", serverUsers)
        console.log(Object.values(serverUsers)[0]);
    }

    const mapServerUsers = () => {
        {serverUsers && Object.values(serverUsers).map(userInfo => {
            <li key = {userInfo.id}>
                {userInfo.userId}
            </li>
        })}
    }

    if (!serverId) return <p>"Loading users"</p>
  return (
    <div>
        { serverId &&
        <ul>
            {mapServerUsers()}
        </ul>
        }
    </div>
  )
}
