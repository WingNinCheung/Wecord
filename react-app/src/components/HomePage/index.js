import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import { getAllServers } from "../../store/servers";
import './HomePage.css'

function HomePage(){

    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const allServers = useSelector(state => state.servers)
    console.log("allservers", allServers)

    useEffect(() => {
        dispatch(getAllServers())
    },[dispatch])






    return(
        <div  className='outContainer'>
            <div className='publicServers'>
             <p>bananan</p>
            </div>
            <div className='privateServers'>

            </div>
            <div className='channels'>

            </div>
            <div className='messages'>

            </div>
            <div className='userLists'>

            </div>

        </div>
    )
}

export default HomePage;
