import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  getFriendsThunk,
  AddFriendThunk,
  unFriendThunk,
} from "../store/friends";
import { useDispatch, useSelector } from "react-redux";
import "./User.css";

function User() {
  const dispatch = useDispatch();
  const yourId = useSelector((state) => state.session.user.id);
  const friendsState = useSelector((state) => state.friends);
  const [user, setUser] = useState({});
  const { userId } = useParams();
  console.log("freinds are ", friendsState);

  let history = useHistory();
  //checking if current user is friends with current profile
  useEffect(() => {
    dispatch(getFriendsThunk(parseInt(userId)));
  }, [dispatch]);

  //ADD A FRIEND BUTTON
  const addFriendButton = async (e) => {
    e.preventDefault();
    await dispatch(AddFriendThunk(yourId, parseInt(userId)));
    await dispatch(getFriendsThunk(parseInt(userId)));
  };

  //UNFRIEND A FRIEND BUTTON
  const removeFriendButton = async (e) => {
    e.preventDefault();
    await dispatch(unFriendThunk(yourId, parseInt(userId)));
    await dispatch(getFriendsThunk(parseInt(userId)));
  };

  //---------------------------------------------------------------------

  useEffect(() => {
    if (!userId) {
      return;
    }
    (async () => {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      setUser(user);
    })();
  }, [userId]);

  if (!user) {
    return null;
  }
  if (friendsState) {
    return (
      <div className="userPage">
        <div className="profileDiv">
          <h3 className="proTitle">User Profile</h3>

            {friendsState[yourId] == undefined &&
            yourId !== parseInt(userId) ? (
              <button onClick={addFriendButton} className="friendBtn">
                Add Friend
              </button>
            ) : (
              yourId !== parseInt(userId) && (
                <button onClick={removeFriendButton} className="friendBtn">
                  Unfriend
                </button>
              )
            )}

          <ul className="userProfile1">
            <li className="useLi1">
              <strong>User Id:</strong> {userId}
            </li>
            <br></br>
            <li className="useLi1">
              <strong>Username:</strong> {user.username}
            </li>
            <br></br>
            <li className="useLi1">
              <strong>Email:</strong> {user.email}
            </li>
          </ul>
            <button className= "friendBtn goBackBtn" onClick={(e) => history.goBack()}>Go Back</button>
        </div>
      </div>
    );
  }
}
export default User;
