import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import caller from '../API-calls.js';

async function respond(interaction, message){
	await interaction.reply({ content: message, flags: MessageFlags.Ephemeral })
}

export default {
	data: new SlashCommandBuilder()
		.setName('playlists')
		.setDescription('Manage playlists')
		.addSubcommand(subCommand =>
			subCommand
				.setName('list')
				.setDescription('Show playlists or info of one.')
				.addStringOption(option =>
		        	option
		        		.setName('id')
		        		.setDescription('The id of the list to show the info of (optional).')
		        		.setRequired(false)
		        )
		)
		.addSubcommand(subCommand =>
			subCommand
				.setName('new')
				.setDescription('Create a playlist.')
				.addStringOption(option =>
		        	option
		        		.setName('name')
		        		.setDescription('The name of your new playlist.')
		        		.setRequired(true)
		        )
		)
		.addSubcommand(subCommand =>
			subCommand
				.setName('edit')
				.setDescription('Edit a playlist.')
		        .addStringOption(option =>
		        	option
		        		.setName('id')
		        		.setDescription('The id of your new playlist (shown in the "playlist-list" output).')
		        		.setRequired(true)
		        )
		        .addStringOption(option =>
		        	option
		        		.setName('name')
		        		.setDescription('The new name of your playlist.')
		        		.setRequired(false)
		        )
		        .addUserOption(option =>
		        	option
		        		.setName('author')
		        		.setDescription('Delegate ownership of your playlist to another user.')
		        		.setRequired(false)
		        )
		)
		.addSubcommand(subCommand =>
			subCommand
				.setName('rm')
				.setDescription('Remove a playlist.')
		        .addStringOption(option =>
		        	option
		        		.setName('id')
		        		.setDescription('The id of your new playlist (shown in the "playlist-list" output).')
		        		.setRequired(true)
		        )
		)
		.addSubcommand(subCommand =>
			subCommand
				.setName('add-song')
				.setDescription('Add a song to a playlist.')
				.addStringOption(option =>
					option
						.setName('id')
						.setDescription('The id of the playlist to add the song to.')
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName('url')
						.setDescription('URL of the song to add. Only works with Youtube and Youtube Music links.')
						.setRequired(true)
				)
		)
		.addSubcommand(subCommand =>
			subCommand
				.setName('rm-song')
				.setDescription('Remove a song from a playlist.')
				.addStringOption(option =>
					option
						.setName('id')
						.setDescription('The id of the song to remove.')
						.setRequired(true)
				)
		),

	async execute(interaction) {
		const userId = interaction.member.user.id;
		const sub = interaction.options.getSubcommand();

		if (sub === "list"){
			const id = interaction.options.getString('id')
			if (id){
				const playlist = await caller.GetPlaylist(id)
				if (playlist.response) return await respond(interaction, playlist.response)

				const author = await caller.GetUserId(playlist.author)
				if (author.response) return await respond(interaction, author.response)

				else{
					let output = `Playlist ${playlist.name}:\n`
					output += `Created by : <@${author.user_id}>\n`
					output += `Collaborators:`
					playlist.collaborations.forEach(collaboration => {
						output += ` <@${collaboration.user_id}>`
					})
					if (playlist.collaborations.length === 0) output += "none"
					output += "\n"
					output += `Length : ${Math.floor(playlist.total_time/60)}m\n`
					output += "```"

					const songs = playlist.songs
					if (songs.length === 0){
						output += `Playlist is empty.\nYou can add a song with "/playlists add-song id:${playlist.id} <song-url>"`
					}else{
						for (let i = 0; i < songs.length; i++){
							output += `${songs[i].id}: ${songs[i].name}\n`
						}
					}
					output += "```"
					respond(interaction, output)
				}
			}else{
				let playlists = await caller.ListPlaylists(userId)
				if (playlists.length > 0){
					let output = "Playlists:\n```"
					for (let i = 0; i < playlists.length ; i++){
						output += `${playlists[i].id}: ${playlists[i].name}\n`
					}
					output += "```"
					await respond(interaction, output)
				}else{
					await respond(interaction, 'No playlist found.')
				}
			}
		}
		else if (sub === "new"){
			let name = interaction.options.getString('name')
			caller.CreatePlaylist(name, userId)
			await interaction.reply({ content: 'Use `/playlists list` to confirm creation.', flags: MessageFlags.Ephemeral })
		}
		else if (sub === "edit"){
			let id = interaction.options.getString('id')
			let newName = interaction.options.getString('name')
			let newAuthor = interaction.options.getUser('author')
			await caller.UpdatePlaylist(userId, id, newName, newAuthor.id)
			await respond(interaction, 'Use `/playlists list` to confirm update.')
		}
		else if (sub === "rm"){
			let id = interaction.options.getString('id')
			await caller.DeletePlaylist(id, userId)
			await respond(interaction, 'Use `/playlists list` to confirm removal.')
		}
		else if (sub === "add-song"){
			let id = interaction.options.getString('id')
			let url = interaction.options.getString('url')
			let response = await caller.AddSong(userId, url, id)
			if (response.response != "success") await respond(interaction, response.response)
			else await respond(interaction, 'Use `/playlists list id:'+id+'` to confirm addition.')
		}
		else if (sub === "rm-song"){
			let id = interaction.options.getString('id')
			let response = await caller.RemoveSong(userId, id)
			await respond(interaction, response.response)
		}	
	}
};