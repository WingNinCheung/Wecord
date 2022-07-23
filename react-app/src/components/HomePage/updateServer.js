// import { useEffect, useState, useContext } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateServer } from "../../store/servers";
// import { useHistory } from "react-router-dom";

// export default function EditServerForm() {
//     const [name, setName] = useState("");
//     const [validationErrors, setValidationErrors] = useState([]);
//     const sessionUser = useSelector((state) => state.session.user.id);
//     const dispatch = useDispatch();
//     const history = useHistory();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const payload = {
//             name
//         }

//         await dispatch(updateServer(payload, serverId));
//         setName("")
//         history.push("/home")

//     };

//     const handleCancel = (e) => {
//         e.preventDefault();
//         history.push("/home");
//     };
//     useEffect(() => {
//         const errors = [];

//         if (!name.length) {
//             errors.push("Server name cannot be empty!");
//         }
//         setValidationErrors(errors);
//     }, [name]);

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <ul>
//                     {validationErrors.map((error) => (
//                         <li key={error}>error</li>
//                     ))}
//                 </ul>
//                 <label>Name</label>
//                 <input
//                     placeholder="Update Server Name"
//                     onChange={(e) => setName(e.target.value)}
//                 ></input>
//                 <button>Edit</button>
//                 <button onClick={handleCancel}>Cancel</button>
//             </form>
//         </div>
//     )
// }
