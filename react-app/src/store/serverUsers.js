// actions
const ADD_SERVERUSER = "serverusers/ADD_SERVERUSER";
const GET_ALL_SERVERUSERS = "serverusers/GET_ALL_SERVERUSERS";
const LEAVE_SERVER = 'serverusers/LEAVE_SERVER'

const getServerUsers = (serverUsers) => {
    return {
        type: GET_ALL_SERVERUSERS,
        serverUsers
    }
}

const addUserToServer = (serverUser) => {
    return {
        type: ADD_SERVERUSER,
        serverUser
    }
}

const deleteUserInServer = (serverUser) => {
    return {
        type: LEAVE_SERVER,
        serverUser
    }
}

export const getAllServerUsers = (serverId) => async (dispatch) => {
    const res = await fetch(`/api/server_users/${serverId}`)

    if (res.ok) {
        const data = await res.json();

        console.log("data from getAllServerUsers------", data);

        dispatch(getServerUsers(data));
        return data;
    }
}

export const addServerUser = (userId, serverId) => async (dispatch) => {
    // /api/server_users
    const res = await fetch('/api/server_users/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, serverId }),
    });

    if (res.ok) {
        const data = await res.json();

        dispatch(addUserToServer(data));
        return data;
    }
}

export const leaveServer = (userId, serverId) => async (dispatch) => {
    // /api/server_users/:serverId

    const res = await fetch(`api/server_users/${serverId}/${userId}`, {
        method: 'DELETE'
    })
    console.log('from del thunk ----------------------------', res)

    if (res.ok) {
        const data = await res.json()
        console.log('from del thunk for data ----------------------------', data)

        dispatch(deleteUserInServer(data))
        return data
    }
}


const serverUsers = (state = {}, action) => {
    let newState = {};

    switch (action.type) {
        case GET_ALL_SERVERUSERS:
            action.serverUsers.server_users.forEach(serverUser => {
                newState[serverUser.id] = serverUser
            });
            return newState;
        case ADD_SERVERUSER:
            newState = {
                ...state,
                [action.serverUser.id]: action.serverUser
            }
            return newState;
        case LEAVE_SERVER:
            newState = { ...state }
            delete newState[action.serverUser]
            return newState
        default:
            return state;
    }
}

export default serverUsers;
