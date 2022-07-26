// GET ALL CHANNELS OF A SERVER

const GET_CHANNELS = "channels/GET_CHANNELS";

const getServerChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    channels,
  };
};

export const getServerChannelsThunk = (serverId) => async (dispatch) => {
  const res = await fetch(`/api/servers/${serverId}/channels`);

  if (res.ok) {
    const allChannels = await res.json();
    console.log("thunk:-----------", allChannels);
    dispatch(getServerChannels(allChannels));
    return res;
  }
};

// READ A SINGLE CHANNEL (MESSAGES)

// CREATE A CHANNEL
const ADD_CHANNELS = "channels/ADD_CHANNELS";

const addChannel = (channel) => {
  return {
    type: ADD_CHANNELS,
    channel,
  };
};

export const createChannel = (channel, serverId) => async (dispatch) => {
  console.log("thunk", serverId);
  const res = await fetch(`/api/servers/${serverId}/channels/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(channel),
  });

  console.log(res);
  if (res.ok) {
    const data = await res.json;

    dispatch(addChannel(data));
    return data;
  }
};

// EDIT A CHANNEL

const UPDATE_CHANNEL = "servers/UPDATE_CHANNEL";

const editChannel = (channel) => {
  return {
    type: ADD_CHANNELS,
    channel,
  };
};

export const updateChannel =
  (title, serverId, channelId) => async (dispatch) => {
    console.log("thunk:", title, serverId, channelId);
    const res = await fetch(
      `/api/servers/${serverId}/channels/${channelId}/edit`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(title),
      }
    );

    const data = await res.json();
    dispatch(editChannel(data));
  };

// DELETE A CHANNEL
const DELETE_CHANNEL = "channels/DELETE_CHANNEL"

const deleteChannel = (channel) => {
  return {
    type: DELETE_CHANNEL,
    channel
  }
}

export const deleteChannelThunk = (serverId, channelId) =>
  async (dispatch) => {
    const res = await fetch(`/api/servers/${serverId}/channels/${channelId}/delete`,
      {
        method: "DELETE"
      });

    console.log("delete thunk:", res)

    if (res.ok) {
      const data = await res.json()
      dispatch(deleteChannel(data))
    }
  }


// ---------------------- REDUCER --------------------------
const channels = (state = {}, action) => {
  let allChannels = {};
  switch (action.type) {
    case GET_CHANNELS:
      action.channels.channels.forEach((channel) => {
        allChannels[channel.id] = channel;
      });
      return allChannels;
    case ADD_CHANNELS:
      if (!state[action.channel.id]) {
        allChannels = { ...state, [action.channel.id]: action.channel };
        return allChannels;
      }
      allChannels = {
        ...state,
        [action.channel.id]: {
          ...state[action.channel.id],
          ...action.channel,
        },
      };
      return allChannels;
    default:
      return state;
  }
};

export default channels;
