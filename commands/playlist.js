import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Manage Beatrice playlists'),

	async execute(interaction) {
		await interaction.reply('peepoo');
	},
};