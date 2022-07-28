import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAllServers } from "../store/servers";
import { addServerUser } from "../store/serverUser"

function UsersList() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const loggedInUserId = sessionUser.id;



  // READ ALL PUBLIC AND PRIVATE SERVERS -------- working
  const allServers = useSelector((state) => state.servers);
  console.log(allServers)
  let allServersArray;
  if (allServers.allServers) allServersArray = Object.values(allServers.notIn);
  let publicServers

  if (allServersArray) {
    publicServers = allServersArray.filter(
      (server) => !server.private
    );
  }


  useEffect(() => {
    dispatch(getAllServers(loggedInUserId));
  }, [dispatch]);


  if (publicServers) {

    return (
      <>
        <h1>Public Servers: </h1>
        <ul>{publicServers.map(server =>
          <li>{server.name}<button onClick={async (e) => {
            e.preventDefault();
            await dispatch(addServerUser(loggedInUserId, server.id))
            await dispatch(getAllServers(loggedInUserId));

          }}>Join</button></li>
        )}
        </ul>
      </>
    )
  } return (<div>Loading...</div>)
}

export default UsersList;
