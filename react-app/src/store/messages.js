const GET_CHANNEL_MESSAGES = "messages/GET_CHANNEL_MESSAGES";
const MAKE_NEW_MESSAGE = "messages/MAKE_NEW_MESSAGE";
const EDIT_MESSAGE = "messages/EDIT_MESSAGE";
const DELETE_MESSAGE = "messages/DELETE_MESSAGE";

// get
const getChannelMessages = (messages) => {
    return {
        type: GET_CHANNEL_MESSAGES,
        messages
    }
}

// create
const createChannelMessage = (message) => {
    return {
        type: MAKE_NEW_MESSAGE,
        message
    }
}

// update
const editChannelMessage = (message) => {
    return {
        type: EDIT_MESSAGE,
        message
    }
}

// delete
const deleteChannelMessage = (message) => {
    return {
        type: DELETE_MESSAGE,
        message
    }
}

//get
export const getChannelMessagesThunk = (channelId) => async(dispatch) => {
    console.log("thunk id:", channelId )
    const res = await fetch(`/api/servers/channels/${channelId}`)
    // const res = await fetch(`/api/servers/${serverId}/${channelId}`)

    if(res.ok){
        const channelMessages = await res.json()
        console.log("thunk:", channelMessages)
        dispatch(getChannelMessages(channelMessages))
        return res
    }
}

// Create
export const createMessage = (message) => async (dispatch) => {

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


// ------------------------- REDUCER -----------------------------
const messages = (state={}, action) => {
    let messages = {}
    switch(action.type){
        case GET_CHANNEL_MESSAGES:
            console.log("in the reducer", action.messages.messages)
            action.messages.messages.forEach((message) => {
                messages[message.id] = message
            })
            return messages;
        default:
            return state;
    }
}

export default messages;
