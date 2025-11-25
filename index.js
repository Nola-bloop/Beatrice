// Import required modules 
const { Client, GatewayIntentBits } = require('discord.js'); 
require('dotenv').config(); 

const KYLE_UID = "451565579401428993"
import { lines } from "./lines/help-response.js" as HELP_RESPONSE_LINES;


function GetRandomLine(lines){
  return lines[Math.floor(Math.random() * lines.length)]
}


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
    message.reply(GetRandomLine(HELP_RESPONSE_LINES)); 
  }
});

// Log in to Discord using token from .env 
client.login(process.env.DISCORD_TOKEN); 
