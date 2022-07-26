import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function DisplayServerUsers({ serverId }) {

    const serverUsers = useSelector(state => state.serverUsers)

    if (serverId) {
        console.log("SERVER ID: ", serverId)
    }

    const mapServerUsers = () => {
        return serverUsers && Object.entries(serverUsers).map(user =>
            <li key = {user[0]}>
                {user[1]}
            </li>
        )
    }



    if (!serverId) return <p>"Loading users"</p>
    console.log("map server users: ", mapServerUsers())
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
