import { SlashCommandBuilder } from 'discord.js';
import caller from '../API-calls.js';

export default {
	data: new SlashCommandBuilder()
		.setName('playlist-list')
		.setDescription('Show your playlists'),

	async execute(interaction) {
		let userId = interaction.member.user.id;
		let playlists = await caller.ListPlaylists(userId)
		if (playlists.length > 0){
			let output = "Playlists:\n```"
			for (let i = 0; i < playlists.length ; i++){
				output += `${playlists[i].id}: ${playlists[i].name}\n`
			}
			output += "```"
			await interaction.reply(output)
		}else{
			await interaction.reply('No playlist found.')
		}
	},
};