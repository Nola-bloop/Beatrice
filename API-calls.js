const API_URL = "http://107.152.41.172:8888"
const module = {
	CreatePlaylist: async (name, userId) => {
		const url = `${API_URL}/playlist?name=${name}&userId=${userId}`;
		await fetch(url, {
		  method: "POST"
		});
	},
	ListPlaylists: async (userId) => {
		const url = `${API_URL}/playlist/user/${userId}`;
		const response = await fetch(url, {
		  method: "GET"
		});
		let data = await response.json()
		return data
	},
	GetPlaylist: async (id) => {
		const url = `${API_URL}/playlist/id/${id}`;
		const response = await fetch(url, {
		  method: "GET"
		});
		let data = await response.json()
		return data
	},
	DeletePlaylist: async (id, userId) => {
		const url = `${API_URL}/playlist?id=${id}&userId=${userId}`;
		const response = await fetch(url, {
		  method: "DELETE"
		});
		let data = await response.json()
		console.log(data)
	}
}

export default module