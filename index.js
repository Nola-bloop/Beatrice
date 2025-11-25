// Import required modules 
const { Client, GatewayIntentBits } = require('discord.js'); 
require('dotenv').config(); 

const KYLE_UID = "451565579401428993"
const HELP_MESSAGES = [
  `Hello there, I couldn't help but notice that you're feeling a little gloomy... Would you mind telling me what's wrong?`,
  `You don't deserve to be`
]


// Create a new Discord client with message intent 
const client = new Client({ 
  intents: [ 
      GatewayIntentBits.Guilds,  
      GatewayIntentBits.GuildMessages,  
      GatewayIntentBits.MessageContent
    ] 
}); 

// Bot is ready 
client.once('ready', () => { 
  console.log(`🤖 Logged in as ${client.user.tag}`); 
}); 

// Listen and respond to messages 
client.on('messageCreate', message => { 

  // Ignore messages from bots 
  if (message.author.bot) return; 

  if (message.author.id === KYLE_UID){ //kyle
    message.react("👎");
  }
  // Respond to a specific message 
  else if (message.content.toLowerCase() === 'help') { 
    message.reply(''); 
  }
});

// Log in to Discord using token from .env 
client.login(process.env.DISCORD_TOKEN); 
