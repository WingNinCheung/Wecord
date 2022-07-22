import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getAllServers } from "../../store/servers";
import "./HomePage.css";

function HomePage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const allServers = useSelector((state) => state.servers);

  const allServersArray = Object.values(allServers);

  const publicServers = allServersArray.filter(
    (server) => server.private === false
  );

  const privateServers = allServersArray.filter(
    (server) =>
      server.private === true && server.master_admin === sessionUser.id
  );
  console.log(privateServers);

  useEffect(() => {
    dispatch(getAllServers());
  }, [dispatch]);

  return (
    <div className="outContainer">
      <div className="publicServers">
        <h3>Public</h3>
        <ul>
          {publicServers &&
            publicServers.map((server) => (
              <li>
                <NavLink to="/">{server.name}</NavLink>
              </li>
            ))}
        </ul>
      </div>
      <div>----------------</div>
      <div className="privateServers">
        <h3>Private</h3>
        <ul>
          {privateServers &&
            privateServers.map((server) => (
              <li>
                <NavLink to="/">{server.name}</NavLink>
              </li>
            ))}
        </ul>
      </div>
      <div className="channels"></div>
      <div className="messages"></div>
      <div className="userLists"></div>
    </div>
  );
}

export default HomePage;
