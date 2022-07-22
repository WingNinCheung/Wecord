// GET ALL PUBLIC SERVERS

const GET_ALL_SERVERS = 'servers/GET_PUBLIC_SERVERS'

const loadAllServers = (servers) => {
    return {
        type: GET_ALL_SERVERS,
        servers
    }
}


export const getAllServers = () => async (dispatch) => {
    const res = await fetch('/api/servers')


    if(res.ok){
        const allServers = await res.json()
        console.log(allServers)
        dispatch(loadAllServers(allServers))
        return res
    }
}




// ------------------- REDUCER ------------------
const servers = (state={}, action) => {
    switch(action.type){
        case GET_ALL_SERVERS:
            const allServers = {}
            action.servers.servers.forEach((server) => {
                allServers[server.id] = server
            })
            return allServers
        default:
            return state
    }

}

export default servers;
