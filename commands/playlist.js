import { SlashCommandBuilder } from 'discord.js';
import caller from '../API-calls.js';

export default {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Manage Beatrice playlists')
		.addStringOption(option =>
            option
                .setName('action')
                .setDescription('Choose an action')
                .setRequired(true)
                .addChoices(
                    { name: 'Create', value: 'create' },
                    { name: 'List', value: 'list' },
                    { name: 'Get', value: 'get' },
                    { name: 'Update', value: 'Update' },
                    { name: 'Delete', value: 'delete' }
                )
        ),

	async execute(interaction) {
		const action = interaction.options.getString('action')
		if (action === "create"){
			let userId = interaction.member.user.id;
			let playlists = caller.ListPlaylists(userId)
			if (playlists.length > 0){
				let output = "```"
				for (let i = 0; i < playlists.length ; i++){
					output += `${playlists[i].id}: ${playlists[i].name}\n`
				}
				output += "```"
				await interaction.reply(output)
			}else{
				await interaction.reply('No playlist found.')
			}
		}
		await interaction.reply('peepoo');
	},
};