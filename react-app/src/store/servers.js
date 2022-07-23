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
  const res = await fetch("/api/servers/add", {
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

// UPDATE A SERVER
const UPDATE_SERVER = 'servers/UPDATE_SERVER'

const editServer = (serverName) => {
  return {
    type: UPDATE_SERVER,
    payload:serverName

  }
}

export const updateServer = (name, id) => async(dispatch) => {
  console.log("thunk:", name, id)
  const res = await fetch(`/api/servers/${id}/edit`, {
    method: "PUT",
    headers:{"Content-Type": "application/json"},
    body: JSON.stringify(name)
  })

  const data = await res.json()
  dispatch(editServer(data))
}

// ------------------- REDUCER ------------------
const servers = (state = {}, action) => {
  let allServers = {};
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
    case UPDATE_SERVER:
      const newState = {...state, [action.payload.id]: action.payload}
      return newState
    default:
      return state;
  }
};

export default servers;
