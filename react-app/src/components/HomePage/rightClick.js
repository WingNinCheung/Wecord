// Right click server menu
export const Menu = ({ x, y }, setEdit, setEditChannel, handleDelete, loggedInUserId, adminId) => {
    return (
        <div
        style={{
            borderRadius: "4px",
            padding: "10px",
            border: "1px solid black",
            boxSizing: "border-box",
            width: "200px",
            position: "absolute",
            top: `${x}px`,
            left: `${y}px`,
            backgroundColor: "gray",
        }}
        >
        <div>
            <button
            onClick={() => {
                setEdit(true);
                setEditChannel(false);
            }}
            disabled={loggedInUserId !== adminId}
            >
            Edit Server
            </button>
        </div>
        <div>
            <button onClick={handleDelete} disabled={loggedInUserId !== adminId}>
            Delete
            </button>
        </div>
        </div>
    );
};

export const channelMenu = ({ x, y }, setEdit, setEditChannel, handleDelete, loggedInUserId, adminId) => {
    return (
        <div
        style={{
            borderRadius: "4px",
            padding: "10px",
            border: "1px solid black",
            boxSizing: "border-box",
            width: "200px",
            position: "absolute",
            top: `${x}px`,
            left: `${y}px`,
            backgroundColor: "gray",
        }}
        >
        <div>
            <button
            onClick={() => {
                setEditChannel(true);
                setEdit(false);
            }}
            disabled={loggedInUserId !== adminId}
            >
            Edit Channel
            </button>
        </div>
        <div>
            <button onClick={handleDelete} disabled={loggedInUserId !== adminId}>
            Delete
            </button>
        </div>
        </div>
    );
};
