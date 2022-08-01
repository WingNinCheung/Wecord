const ADD_FRIEND = "addafriendpls";
const GET_FRIENDS = "getsomefriendspls";
const STOP_BEING_FRIENDS = "weaintfriendsnomopls";

const addFriend = (friend) => {
  return {
    type: ADD_FRIEND,
    friend,
  };
};

const getFriends = (friends) => {
  return {
    type: GET_FRIENDS,
    friends,
  };
};

const notAFriend = (friend) => {
  return {
    type: STOP_BEING_FRIENDS,
    friend,
  };
};

export const unFriendThunk = (userId, friendId) => async (dispatch) => {
  const res = await fetch(`/api/friends/${userId}/${friendId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(notAFriend(data));
    return await data;
  }
};

export const getFriendsThunk = (userId) => async (dispatch) => {
  const res = await fetch(`/api/friends/yourfriends/${userId}`);
  if (res.ok) {
    const data = await res.json();
    await dispatch(getFriends(data));
    console.log(data);
    return await data;
  }
};

export const AddFriendThunk = (userId, friendId) => async (dispatch) => {
  console.log(userId, friendId);
  const res = await fetch("/api/friends", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, friendId }),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addFriend(data));
    return data;
  }
};

const friendsReducer = (state = {}, action) => {
  let newState = {};
  switch (action.type) {
    case GET_FRIENDS:
      action.friends.friends.forEach((friend) => {
        newState[friend.friendId] = friend;
      });
      action.friends.eachFriend.forEach((friend) => {
        newState[friend.username] = friend;
      });
      return newState;
    case ADD_FRIEND:
      newState = { ...state };
      newState[action.friend.newFriend.userId] = action.friend.newFriend;
      return newState;
    case STOP_BEING_FRIENDS:
      newState = { ...state };
      delete newState[action.friend.userId];
    default:
      return state;
  }
};

export default friendsReducer;
