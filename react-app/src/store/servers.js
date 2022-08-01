// GET ALL PUBLIC SERVERS
const GET_ALL_SERVERS = "servers/GET_PUBLIC_SERVERS";
// const GET_ONE_SERVER = 'servers/GET_ONE'
const CREATE_SERVER = "servers/CREATE_SERVER";
const UPDATE_SERVER = "servers/UPDATE_SERVER";
const DELETE_SERVER = "servers/DELETE_SERVER";
const GET_YOURS = 'sersefsedzfesaf'

const getYourServers = (servers) => {
  return {
    type: GET_YOURS,
    servers
  }
}

const loadAllServers = (servers) => {
  return {
    type: GET_ALL_SERVERS,
    servers,
  };
};

// const loadOneServer = (server) => {
//   return {
//     type: GET_ONE_SERVER,
//     server
//   }
// }

const addServer = (server) => {
  return {
    type: CREATE_SERVER,
    server,
  };
};

const editServer = (serverName) => {
  return {
    type: UPDATE_SERVER,
    payload: serverName,
  };
};

const delServer = (serverToDelete) => {
  return {
    type: DELETE_SERVER,
    serverToDelete,
  };
};

//get all your servers
export const getAllYourServersThunk = (userId) => async (dispatch) => {
  const res = await fetch(`/api/servers/private/${userId}`)
  if (res.ok) {
    const data = await res.json()
    dispatch(getYourServers(data))
    return data
  }
}

// Get all
export const getAllServers = (userId) => async (dispatch) => {
  const res = await fetch(`/api/servers/yourServers/${userId}`);

  if (res.ok) {
    const allServers = await res.json();
    dispatch(loadAllServers(allServers));
    return res;
  }
};

// export const getOneServer = (id) => async (dispatch) => {
//   const res = await fetch(`/api/servers/${id}`)

// }

// Create
export const createServer = (server) => async (dispatch) => {
  const res = await fetch("/api/servers/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(server),
  });

  if (res.ok) {
    const data = await res.json;

    dispatch(addServer(data));
    return data;
  }
};

// Update
export const updateServer = (name, id) => async (dispatch) => {
  const res = await fetch(`/api/servers/${id}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(name),
  });

  const data = await res.json();
  dispatch(editServer(data));
};

// Delete
export const deleteServer = (id, userId) => async (dispatch) => {
  const res = await fetch(`/api/servers/${id}/${userId}/delete`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(delServer(data));
  }
};

// ------------------- REDUCER ------------------
const servers = (state = {}, action) => {
  let allServers = {};
  let newState = {};
  switch (action.type) {
    case GET_ALL_SERVERS:
      allServers.allServers = {}
      action.servers.servers.forEach((server) => {
        allServers.allServers[server.id] = server;
      });
      allServers['yourServers'] = action.servers.yourservers
      allServers['notIn'] = action.servers.serversnotin
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
      newState = { ...state, [action.payload.id]: action.payload };
      return newState;
    case DELETE_SERVER:
      newState = { ...state };
      delete newState[action.serverToDelete];
      return newState;
    default:
      return state;
  }
};

export default servers;
