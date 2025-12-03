import { SlashCommandBuilder } from 'discord.js';
import caller from '../API-calls.js';

export default {
	data: new SlashCommandBuilder()
		.setName('playlist-new')
		.setDescription('Create a playlist.')
        .addStringOption(option =>
        	option
        		.setName('name')
        		.setDescription('The name of your new playlist.')
        		.setRequired(true)
        ),

	async execute(interaction) {
		let userId = interaction.member.user.id;
		let name = interaction.options.getString('name')
		caller.CreatePlaylist(name, userId)
		await interaction.reply('Use `/playlist-list` to confirm creation.')
},
};