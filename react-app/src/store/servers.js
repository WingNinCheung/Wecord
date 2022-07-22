// GET ALL PUBLIC SERVERS

const GET_ALL_SERVERS = "servers/GET_PUBLIC_SERVERS";
const CREATE_SERVER = "servers/CREATE_SERVER";

const loadAllServers = (servers) => {
  return {
    type: GET_ALL_SERVERS,
    servers,
  };
};

const addServer = (server) => {
  return {
    type: CREATE_SERVER,
    server,
  };
};

export const getAllServers = () => async (dispatch) => {
  const res = await fetch("/api/servers");

  if (res.ok) {
    const allServers = await res.json();
    // console.log(allServers);
    dispatch(loadAllServers(allServers));
    return res;
  }
};

export const createServer = (server) => async (dispatch) => {
  console.log(server);
  const res = await fetch("/api/servers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(server),
  });

  console.log(res);
  if (res.ok) {
    const data = await res.json;

    dispatch(addServer(data));
    return data;
  }
};

// ------------------- REDUCER ------------------
const servers = (state = {}, action) => {
  const allServers = {};
  switch (action.type) {
    case GET_ALL_SERVERS:
      action.servers.servers.forEach((server) => {
        allServers[server.id] = server;
      });
      return allServers;
    case CREATE_SERVER:
      if (!state[action.server.id]) {
        allServers = { ...state, [action.server.id]: action.server };
        return allServers;
      }
      allServers = {
        ...state,
        [action.server.id]: {
          ...state[action.server.id],
          ...action.server,
        },
      };
      return allServers;
    default:
      return state;
  }
};

export default servers;
