// GET ALL MESSAGES OF A CHANNEL

const GET_CHANNEL_MESSAGES = "messages/GET_CHANNEL_MESSAGES"

const getChannelMessages = (messages) => {
    return {
        type: GET_CHANNEL_MESSAGES,
        messages
    }
}

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
