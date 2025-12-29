import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import caller from '../API-calls.js';

const daysOfTheWeek = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
]
const monthsOfTheYear = [
	"January",
	"Febuary",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
]

const sortByDate = (a, b) => {
    return a.date - b.date;
};

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
		)
		.addSubcommand(subCommand =>
			subCommand
				.setName('list')
				.setDescription('See all birthdays')
		),

	async execute(interaction) {
		const userId = interaction.member.user.id;
		const sub = interaction.options.getSubcommand();

		if (sub === "set"){
			const day = interaction.options.getString('day')
			const month = interaction.options.getString('month')
			const year = interaction.options.getString('year')

			let res = await caller.SetBirthday(userId, day, month, year)

			if (res.response) return caller.Respond(interaction, res.response)
		}else if (sub === "list"){
			let birthdays = await caller.ListBirthdays()

			if (birthdays.response) return await caller.Respond(interaction, birthdays.response)

			if (birthdays.length === 0) return await caller.Respond(interaction, "No one has set their birthdays yet!")

			let output = ""
			output += "ㅤ\nList of birthdays:\n"

			let currentDate = new Date()
			let farthestSkippedBday = -1
			let flag = false

			//remember year and set all years on same base. Also convert string date to date obj 
			for (let i = 0; i < birthdays.length; i++){
				birthdays[i].year = new Date(birthdays[i].date).getFullYear()
				birthdays[i].date = new Date(birthdays[i].date)
				birthdays[i].date.setFullYear(currentDate.getFullYear())
				console.log(birthdays[i].date)
			}

			birthdays = birthdays.sort(sortByDate)

			for (let i = 0; i < birthdays.length; i++){
				let user = await caller.GetUser(birthdays[i].user_id)
				user = user.user_id
				let date = birthdays[i].date

				let day = date.getDate()+
				let month = monthsOfTheYear[date.getMonth()]
				let thingie = "th"
				if (day % 10 == 1 && day !== 11) thingie = "st"
				else if (day % 10 == 2 && day !== 12) thingie = "nd"
				else if (day % 10 == 3 && day !== 13) thingie = "rd"

				//the flag lets the program start showing birthdays putting the nearest one first and farthest one last
				if (!flag){
					if (currentDate < date) farthestSkippedBday = i
					else output += `\n<@${user}> \`${month} ${day}${thingie}, ${birthdays[i].year}\``
				}else{
					if (i <= farthestSkippedBday)
					output += `\n<@${user}> \`${month} ${day}${thingie}, ${birthdays[i].year}\``
				}

				if (i == birthdays.length-1 && farthestSkippedBday != -1){
					i = 0
					flag = true
				}
			}

			caller.Respond(interaction, output)
		}
	}
};