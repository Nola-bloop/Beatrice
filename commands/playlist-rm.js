import { SlashCommandBuilder } from 'discord.js';
import caller from '../API-calls.js';

export default {
	data: new SlashCommandBuilder()
		.setName('playlist-rm')
		.setDescription('Remove a playlist.')
        .addStringOption(option =>
        	option
        		.setName('id')
        		.setDescription('The id of your new playlist (shown in the "playlist-list" output).')
        		.setRequired(true)
        ),

	async execute(interaction) {
		let userId = interaction.member.user.id;
		let id = interaction.options.getString('id')
		await caller.DeletePlaylist(id, userId)
		await interaction.reply('Use `/playlist list` to confirm removal.')
	},
};