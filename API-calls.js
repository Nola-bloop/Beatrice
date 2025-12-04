const API_URL = "http://107.152.41.172:8888"
const module = {
	GetUserId : async (id) => {
		const fetchUrl = `${API_URL}/user/id/${id}`;
		console.log(fetchUrl)
		const response = await fetch(fetchUrl, {
		  method: "POST"
		});
		//let data = await response.json()
		//return data
		return {user_id:"1"}
	},
	CreatePlaylist: async (name, userId) => {
		const url = `${API_URL}/playlist?name=${name}&userId=${userId}`;
		const response = await fetch(url, {
		  method: "POST"
		});
		let data = await response.json()
		return data
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
	UpdatePlaylist: async (userId, id, name, author) => {
		let url = `${API_URL}/playlist?`

		if (!id && !userId && (!name || author)) return;

		url += `userId=${userId}&`
		url += `id=${id}&`

		if (name) url+=`name=${name}&`
		if (author) url+=`author=${author}&`
		url = url.slice(0, -1)
		const response = await fetch(url, {
		  method: "PUT"
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
		return data
	},
	AddSong : async (userId, url, playlistId) => {
		const fetchUrl = `${API_URL}/song?userId=${userId}&url=${url}&playlistId=${playlistId}`;
		const response = await fetch(fetchUrl, {
		  method: "POST"
		});
		let data = await response.json()
		return data
	}
}

export default module