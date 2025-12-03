import { SlashCommandBuilder } from 'discord.js';
import caller from '../API-calls.js';

export default {
	data: new SlashCommandBuilder()
		.setName('playlist-list')
		.setDescription('Show your playlists')
        .addStringOption(option =>
        	option
        		.setName('name')
        		.setDescription('Required if <name> is in command description. ')
        		.setRequired(false)
        ),

	async execute(interaction) {
		let userId = interaction.member.user.id;
		let playlists = await caller.ListPlaylists(userId)
		if (playlists.length > 0){
			let output = "```"
			for (let i = 0; i < playlists.length ; i++){
				output += `${playlists[i].id}: ${playlists[i].name}\n`
			}
			output += "Playlists:\n```"
			await interaction.reply(output)
		}else{
			await interaction.reply('No playlist found.')
		}
		/*
		else if (action == "create"){
			let userId = interaction.member.user.id;
			let name = interaction.options.getString('name')
			caller.CreatePlaylist(name, userId)
			await interaction.reply('Use `/playlist list` to confirm creation.')
		}
		else{
			await interaction.reply('Unkown parameters.')
		}*/
	},
};