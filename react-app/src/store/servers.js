// GET ALL PUBLIC SERVERS
const GET_ALL_SERVERS = "servers/GET_PUBLIC_SERVERS";
// const GET_ONE_SERVER = 'servers/GET_ONE'
const CREATE_SERVER = "servers/CREATE_SERVER";
const UPDATE_SERVER = 'servers/UPDATE_SERVER'
const DELETE_SERVER = "servers/DELETE_SERVER";

const loadnewState = (servers) => {
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
    payload: serverName

  }
}

const delServer = (serverToDelete) => {
  return {
    type: DELETE_SERVER,
    serverToDelete
  }
};

// Get all
export const getnewState = () => async (dispatch) => {
  const res = await fetch("/api/servers");

  if (res.ok) {
    const newState = await res.json();
    dispatch(loadnewState(newState));
    return res;
  }
};

// export const getOneServer = (id) => async (dispatch) => {
//   const res = await fetch(`/api/servers/${id}`)

// }

// Create
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

// Update
export const updateServer = (name, id) => async (dispatch) => {
  console.log("thunk:", name, id)
  const res = await fetch(`/api/servers/${id}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(name)
  });

  const data = await res.json()
  dispatch(editServer(data))
}

// Delete
export const deleteServer = (id) => async (dispatch) => {
  console.log("thunk:", id)
  const res = await fetch(`/api/servers/${id}/delete`, {
    method: "DELETE"
  });

  if (res.ok) {
    const data = await res.json()
    dispatch(delServer(data))
  }

}


// ------------------- REDUCER ------------------
const servers = (state = {}, action) => {

  let newState = {};
  switch (action.type) {

    case GET_ALL_SERVERS:
      action.servers.servers.forEach((server) => {
        newState[server.id] = server;
      });
      return newState;
    case CREATE_SERVER:
      if (!state[action.server.id]) {
        newState = { ...state, [action.server.id]: action.server };
        return newState;
      }
      newState = {
        ...state,
        [action.server.id]: {
          ...state[action.server.id],
          ...action.server,
        },
      };
      return newState;
    case UPDATE_SERVER:
      newState = { ...state, [action.payload.id]: action.payload }
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
