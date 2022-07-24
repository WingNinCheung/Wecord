import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory} from "react-router-dom";
import { useEffect, useState} from "react";
import { getAllServers, updateServer } from "../../store/servers";
import "./HomePage.css";

function HomePage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const allServers = useSelector((state) => state.servers);

    const allServersArray = Object.values(allServers);

    const publicServers = allServersArray.filter(
        (server) => server.private === false
    );
    console.log(publicServers)

    const privateServers = allServersArray.filter(
        (server) =>
            server.private === true && server.master_admin === sessionUser.id
    );

    useEffect(() => {
        dispatch(getAllServers());
    }, [dispatch]);

    // edit server form - may use modal to refactor it
    const [name, setName] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);
    const [mainServer, setMainServer] = useState(false)
    const [selectedServerId, setSelectedServerId] = useState(1)
    const [adminId, setAdminId] = useState(1)
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();


        if(adminId === sessionUser.id){
            const payload = {
                name
            }
            console.log(name)
            await dispatch(updateServer(payload, selectedServerId));
            setName("")
            setMainServer(false)
            history.push("/home")

        }else{
            setValidationErrors(['only master admin can edit public servers'])
            setName("")
            history.push("/home")
        }

    };


    const handleCancel = (e) => {
        e.preventDefault();
        history.push("/home");
    };

    // const handleUserClick = (e) => {
    //     e.preventDefault();
    //     setAdminId(server.master_admin)
    //     console.log(adminId)

    // }

    useEffect(() => {
        const errors = [];

        if (!name.length) {
            errors.push("Server name cannot be empty!");
        }
        setValidationErrors(errors);
    }, [name]);

    // -------------------------------------------------

    return (
        <div className="outContainer">
            <NavLink to="/create-server">Add a Server</NavLink>
            <div></div>
            {/* <NavLink to="/update-server">Edit a Server</NavLink> */}
            <div className="publicServers">
                <h3>Public</h3>
                <ul>
                    {publicServers &&
                        publicServers.map((server) => (
                            <li key={server.id}>
                                <button onClick={() => {
                                    setMainServer(true)
                                    setSelectedServerId(server.id)
                                    setAdminId(server.master_admin)

                                }}>{server.name}</button>
                            </li>
                        ))}
                </ul>
                {/* <ul>
                    {publicServers &&
                        publicServers.map((server) => (
                            <li key={server.id}>
                                <button onClick={handleUserClick}>{server.name}</button>
                            </li>
                        ))}
                </ul> */}
            </div>
            <div>----------------</div>
            <div className="privateServers">
                <h3>Private</h3>
                <ul>
                    {privateServers &&
                        privateServers.map((server) => (
                            <li key={server.id}>
                                <button onClick={() => {
                                    setMainServer(true)
                                    setSelectedServerId(server.id)

                                }}>{server.name}</button>
                            </li>
                        ))}
                </ul>
            </div>
            <div>------------------------</div>
            <div>
                {mainServer ? (
                    <div>
                        <h3>Update Yout Server Here!</h3>
                        <form onSubmit={handleSubmit}>
                            <ul>
                                {validationErrors.map((error) => (
                                    <li key={error}>only master admin can edit</li>
                                ))}
                            </ul>
                            <label>Name</label>
                            <input
                                placeholder="Update Server Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                            <button>Edit</button>
                            <button onClick={handleCancel} disabled={!!validationErrors.length}>Cancel</button>
                        </form>
                    </div>
                ) :
                    <div> </div>}
            </div>
            <div className="channels"></div>
            <div className="messages"></div>
            <div className="userLists"></div>
        </div>
    );
}

export default HomePage;
