import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsThunk } from "../../store/friends";
import { NavLink } from 'react-router-dom';


const FriendsList = () => {
    const dispatch = useDispatch()

    const yourId = useSelector(state => state.session.user.id)
    const friendsState = useSelector(state => state.friends)

    let friendsList = []
    if (friendsState) {

        const array = (Object.values(friendsState))
        array.forEach(person => {
            if (person.username) {
                friendsList.push(person)
            }
        })
    }


    useEffect(() => {
        dispatch(getFriendsThunk(parseInt(yourId)))
    }, [dispatch])

    return (
        <>
            <h1>Friends List</h1>
            <ul>
                {friendsList.length > 0 && friendsList.map(friend => (
                    <li><NavLink to={`/users/${friend.id}`}>{friend.username}</NavLink></li>
                ))}
                {friendsList.length === 0 && <li>Sorry, you have no friends</li>}

            </ul>
        </>
    )
}
export default FriendsList
