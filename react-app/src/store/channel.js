// GET ALL CHANNELS OF A SERVER

const GET_CHANNELS = "channels/GET_CHANNELS"

const getServerChannels = (channels) => {
    return {
        type:GET_CHANNELS,
        channels

    }
}

export const getServerChannelsThunk = (serverId) => async(dispatch) => {
    const res = await fetch(`/api/servers/${serverId}/channels`)

    if (res.ok) {
        const allChannels = await res.json()
        console.log("thunk:", allChannels)
        dispatch(getServerChannels(allChannels))
        return res;
    }
}

// READ A SINGLE CHANNEL (MESSAGES)


// CREATE A CHANNEL


// EDIT A CHANNEL


// DELETE A CHANNEL


// ---------------------- REDUCER --------------------------
const channels = (state={}, action) => {
    let allChannels = {};
    switch(action.type){
        case GET_CHANNELS:
            action.channels.channels.forEach((channel) => {
                allChannels[channel.id] = channel;
              });
              return allChannels;
        default:
            return state;
    }
}

export default channels;
