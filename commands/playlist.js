import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import caller from '../API-calls.js';

async function respond(interaction, message){
	await interaction.reply({ content: message, flags: MessageFlags.Ephemeral })
}

export default {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Manage playlists')
		.addSubcommand(subCommand =>
			subCommand
				.setName('list')
				.setDescription('Show playlists.')
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
		),

	async execute(interaction) {
		let userId = interaction.member.user.id;
		const sub = interaction.options.getSubcommand();

		if (sub === "list"){
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
		else if (sub === "new"){
			let name = interaction.options.getString('name')
			caller.CreatePlaylist(name, userId)
			await interaction.reply({ content: 'Use `/playlist list` to confirm creation.', flags: MessageFlags.Ephemeral })
		}
		else if (sub === "edit"){
			let id = interaction.options.getString('id')
			let newName = interaction.options.getString('name')
			let newAuthor = interaction.options.getUser('author')
			console.log(newAuthor.id)
			await caller.UpdatePlaylist(userId, id, newName, newAuthor.id)
			await respond(interaction, 'Use `/playlist list` to confirm update.')
		}
		else if (sub === "rm"){
			let id = interaction.options.getString('id')
			await caller.DeletePlaylist(id, userId)
			await respond(interaction, 'Use `/playlist list` to confirm removal.')
		}
	}
};