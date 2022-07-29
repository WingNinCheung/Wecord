import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsThunk } from "../../store/friends";
import { NavLink } from 'react-router-dom';
import './friends.css'

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
        <div className='friendslistdiv'>
            <h1 className="FriendsListTitle">Friends List</h1>
            <ul className="ulforfriends">
                {friendsList.length > 0 && friendsList.map(friend => (
                    <li className="liforfriends"><NavLink className='linkforfriends' to={`/users/${friend.id}`}>{friend.username}</NavLink></li>
                ))}
                {friendsList.length === 0 && <li>Sorry, you have no friends</li>}

            </ul>
        </div>
    )
}
export default FriendsList
