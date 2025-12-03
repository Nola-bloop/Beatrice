import { SlashCommandBuilder } from 'discord.js';
import caller from '../API-calls.js';

export default {
	data: new SlashCommandBuilder()
		.setName('playlist-edit')
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
        ),

	async execute(interaction) {
		let userId = interaction.member.user.id;
		let id = interaction.options.getString('id')
		let newName = interaction.options.getString('name')
		let newAuthor = interaction.options.getUser('author')
		await caller.UpdatePlaylist(userId, id, newName, newAuthor)
		await interaction.reply('Use `/playlist-list` to confirm update.')
	},
};