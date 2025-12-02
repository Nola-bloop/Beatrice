const API_URL = "http://107.152.41.172:8888"
const module = {
	CreatePlaylist: async (name, userId) => {
		const url = `${API_URL}/playlist?name=${name}&userId=${userId}`;
		const response = await fetch(url, {
		  method: "POST"
		});
	},
	ListPlaylists: async (userId) => {
		const url = `${API_URL}/playlist/user/${userId}`;
		const response = await fetch(url, {
		  method: "GET"
		});
		return response.hits
	},
	GetPlaylist: async (id) => {
		const url = `${API_URL}/playlist/id/${id}`;
	}
}

export default module