// actions
const ADD_SERVERUSER = "serverusers/ADD_SERVERUSER";

const addUserToServer = (serverUser) => {
    return {
        type: ADD_SERVERUSER,
        serverUser
    }
}


export const addServerUser = (userId, serverId) => async (dispatch) => {
    // /api/server_users
    const res = await fetch('/api/server_users', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userId, serverId),
    });

    if (res.ok) {
        const data = await res.json;

        dispatch(addUserToServer(data));
        return data;
    }
}

export default serverUsers = (state = {}, action) => {
    let newState = {};

    switch (action.type) {
        case ADD_SERVERUSER:
            newState = {
                ...state,
                [action.serverUser.id]: action.serverUser
            }
            return newState;
    }
}
