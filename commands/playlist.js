import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus, VoiceConnectionStatus } from "@discordjs/voice";
import caller from '../API-calls.js';
import player from '../player.js';

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
						.setName('song-id')
						.setDescription('The id of the song to remove.')
						.setRequired(true)
				)
		)
		.addSubcommand(subCommand =>
			subCommand
				.setName('invite')
				.setDescription('Invite a collaborator.')
				.addStringOption(option =>
					option
						.setName('playlist-id')
						.setDescription('The id of the playlist.')
						.setRequired(true)
				)
				.addUserOption(option =>
					option
						.setName('collaborator')
						.setDescription('The user to invite as collaborator.')
						.setRequired(true)
				)
		)
		.addSubcommand(subCommand =>
			subCommand
				.setName('uninvite')
				.setDescription('Uninvite a collaborator.')
				.addStringOption(option =>
					option
						.setName('playlist-id')
						.setDescription('The id of the playlist.')
						.setRequired(true)
				)
				.addUserOption(option =>
					option
						.setName('collaborator')
						.setDescription('The user to uninvite (remove) as collaborator.')
						.setRequired(true)
				)
		)
		.addSubcommand(subCommand =>
			subCommand
				.setName('play')
				.setDescription('Play a playlist.')
				.addStringOption(option =>
					option
						.setName('playlist-id')
						.setDescription('The id of the playlist.')
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
					for (let i = 0; i < playlist.collaborations.length; i++) {
						let collaborator = await caller.GetUserId(playlist.collaborations[i].collaborator)
						output += ` <@${collaborator.user_id}>`
					}
					if (playlist.collaborations.length === 0) output += "none"
					output += "\n"
					output += `Length : ${Math.floor(playlist.total_time/60)} minutes\n`
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
			let id = interaction.options.getString('song-id')
			let response = await caller.RemoveSong(userId, id)
			await respond(interaction, response.response)
		}
		else if (sub === "invite"){
			let collaborator = interaction.options.getUser('collaborator')
			let playlistId = interaction.options.getString('playlist-id')
			let response = await caller.InviteCollaborator(userId, collaborator.id, playlistId)
			console.log("THE API RESPONSE: " + response)
			await respond(interaction, response.response)
		}
		else if (sub === "uninvite"){
			let collaborator = interaction.options.getUser('collaborator')
			let playlistId = interaction.options.getString('playlist-id')
			let response = await caller.UninviteCollaborator(userId, collaborator.id, playlistId)
			await respond(interaction, response.response)
		}
		else if (sub === "play"){
			let playlistId = interaction.options.getString('playlist-id')
			let playlist = await caller.GetPlaylist(playlistId)

			let channel = interaction.member.voice.channel
			if (!channel) {
				await respond(interaction, "You need to be in a channel.")
				return;
		    }

			let connection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator
			})

			player.PlayList(connection, playlist.songs, (msg) => {
				respond(interaction, msg)
				debug.log(msg)
			})


			await respond(interaction, "Downloading musics, it should start playing shortly.")
		}
	}
};