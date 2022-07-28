import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFriendsThunk, AddFriendThunk, unFriendThunk } from '../store/friends';
import { useDispatch, useSelector } from "react-redux";

function User() {
  const dispatch = useDispatch()
  const yourId = useSelector(state => state.session.user.id)
  const friendsState = useSelector(state => state.friends)
  const [user, setUser] = useState({});
  const { userId } = useParams();
  console.log(friendsState)
  //checking if current user is friends with current profile
  useEffect(() => {
    dispatch(getFriendsThunk(parseInt(userId)))
  }, [dispatch])



  //ADD A FRIEND BUTTON
  const addFriendButton = async (e) => {
    e.preventDefault()
    await dispatch(AddFriendThunk(yourId, parseInt(userId)))
    await dispatch(getFriendsThunk(parseInt(userId)))
  }

  //UNFRIEND A FRIEND BUTTON
  const removeFriendButton = async (e) => {
    e.preventDefault()
    await dispatch(unFriendThunk(yourId, parseInt(userId)))
    await dispatch(getFriendsThunk(parseInt(userId)))

  }

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
      <ul>

        {((friendsState[yourId] == undefined) && (yourId !== parseInt(userId))) ? <button onClick={addFriendButton}>Add Friend</button> :
          (yourId !== parseInt(userId)) && <button onClick={removeFriendButton}>Unfriend</button>}

        <li>
          <strong>User Id</strong> {userId}
        </li>
        <li>
          <strong>Username</strong> {user.username}
        </li>
        <li>
          <strong>Email</strong> {user.email}
        </li>
      </ul>
    );
  }
}
export default User;
