import { PollLayoutType } from "discord.js";

const uncategorized = [
	{
		poll: {
			question: { text: 'Should you kill yourself?' },
			answers: [
				{ text: 'Yes!', emoji: '😁' },
			],
			allowMultiselect: false,
			duration: 2,
			layoutType: PollLayoutType.Default,
		}
	},
	{
		poll: {
			question: { text: 'How your villain arc starts:' },
			answers: [
				{ text: 'Patricide.', emoji: '🙄' },
				{ text: 'Some untold horrors with a printer.', emoji: '💅' },
				{ text: 'Group project (AKA collective ending of one\'s self).', emoji: '✨' },
				{ text: 'A psychological war with *the cat*.', emoji: '🙀' },
			],
			allowMultiselect: false,
			duration: 2,
			layoutType: PollLayoutType.Default,
		}
	},
	{
		poll: {
			question: { text: 'What makes you happy?' },
			answers: [
				{ text: 'ꓭ̵̧̛͙̗̣͈́̂͂́ǝ̷͍̥̪̘̀̇̿̓͜͝ɒ̸̛͚̩̣͉̱͒̓̐͂Ɉ̷̛̹̮̯̱̗̉̅̐̚ɿ̶̹̫̩̀̅͗̋̋ͅͅȋ̴̡̳͓̰̜̇̋̈́̃ɔ̶̢̢̛͙̗̮͐̈̕͝ǝ̴̹̫͚͔̻̊̇̂̽͝', emoji: '👍' },
				{ text: 'm̷̢͔̫̟̖͛̃̽̈́̀γ̷̗͍͎͎̙͊͂̉͆͝ ̶̳̖͇̭͋̊͐̐͜͝l̴͎͔̭̠̞̄̓̄̈͊ɒ̶̞͉̺̭̖͗́̄̕͝w̷̰͙̥̲̭̾́́̎͋γ̴̢̤̞̬̠̓̑̍͝͝ǝ̶̧͎͎͇̅̿́̋͝ͅɿ̴͍͙̱͎̩͆̋̉̂̚', emoji: '👍' },
				{ text: 'n̴̡̻̖͉̘̂̓̓͑̚ȏ̵͓̖̖̞͌͆̑̚͜ḻ̵̛͎͇̪̟̑́̇̇ɒ̴̧̹̰̪̪̀̈́̓́̔ƨ̸̱̤̫̱͍̌̾̓͆̿ ̷̢̧̹̙̼͒͐̈́̚͝ḑ̴̧̡͚͍̿̅̈́̌ǫ̵̞͎̿̋̔̅̑͜ͅɈ̵̢̬͚̪̒̒̍͗̾͜', emoji: '👍' },
				{ text: 'ḑ̴͓̫̫̮͛̌̽̃̾ǝ̵̜̗̪̹̺̓̀͌̔͝ɒ̸͇̪̰̯̻͐̈́̂̓̄Ɉ̷͉͎̰̜̰͊̿̀̍̑ɿ̶̲̫͉̙̭͂̐͒̐̋ĩ̶̺͎̟̼̼͗̑̚͝ɔ̸̤͓̣̬̫͒̀̓̾̃ǝ̶̳̟̥̮͓͋͗́̚̕', emoji: '👍' },
			],
			allowMultiselect: false,
			duration: 2,
			layoutType: PollLayoutType.Default,
		}
	},
]

export { uncategorized }