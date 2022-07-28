const LOAD_USER = "users/LOAD_USERS";

const loadUser = (user) => {
  return {
    type: LOAD_USER,
    user,
  };
};

export const getAllUsers = () => async (dispatch) => {
  const res = await fetch("/api/users/");

  if (res.ok) {
    const allUsers = await res.json();
    dispatch(loadUser(allUsers.users));
    return res;
  }
};

const users = (state = {}, action) => {
  switch (action.type) {
    case LOAD_USER:
      let newState = {};
      action.user.forEach((user) => {
        newState[user.id] = user;
      });
      return newState;
    default:
      return state;
  }
};

export default users;
