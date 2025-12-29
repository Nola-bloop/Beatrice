import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import caller from '../API-calls.js';

async function respond(interaction, message){
	await interaction.reply({ content: message, flags: MessageFlags.Ephemeral })
}

let connection;

export default {
	data: new SlashCommandBuilder()
		.setName('birthday')
		.setDescription('Manage birthdays')
		.addSubcommand(subCommand =>
			subCommand
				.setName('set')
				.setDescription('Set your birthday!')
				.addStringOption(option =>
		        	option
		        		.setName('day')
		        		.setDescription('Your day, ranging 1-31')
		        		.setRequired(true)
		        )
		        .addStringOption(option =>
		        	option
		        		.setName('month')
		        		.setDescription('Your month.')
		        		.setRequired(true)
		        		.setChoices([
		        			{
							    name: "January",
								value: "0"
						 	},
						 	{
							    name: "Febuary",
								value: "1"
						 	},
						 	{
							    name: "March",
								value: "2"
						 	},
						 	{
							    name: "April",
								value: "3"
						 	},
						 	{
							    name: "May",
								value: "4"
						 	},
						 	{
							    name: "June",
								value: "5"
						 	},
						 	{
							    name: "July",
								value: "6"
						 	},
						 	{
							    name: "August",
								value: "7"
						 	},
						 	{
							    name: "September",
								value: "8"
						 	},
						 	{
							    name: "October",
								value: "9"
						 	},
						 	{
							    name: "November",
								value: "10"
						 	},
						 	{
							    name: "December",
								value: "11"
						 	},
		        		])
		        )
		        .addStringOption(option =>
		        	option
		        		.setName('year')
		        		.setDescription('Your year.')
		        		.setRequired(true)
		        )
		),

	async execute(interaction) {
		const userId = interaction.member.user.id;
		const sub = interaction.options.getSubcommand();

		if (sub === "set"){
			const day = interaction.options.getString('day')
			const month = interaction.options.getString('month')
			const year = interaction.options.getString('year')

			let res = await caller.SetBirthday(userId, day, month, year)

			if (res.response) caller.respond(interaction, res.response)
		}
	}
};