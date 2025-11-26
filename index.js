// Import required modules 
import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } from "@discordjs/voice";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {
  help as HELP_RESPONSES,
  rude as RUDE_RESPONSES,
  busy as BUSY_RESPONSES,
  joining as JOINING_RESPONSES,
  copypastas as COPYPASTAS,
  legalAdvice as LEGAL_ADVICE,
} from './lines/responses.js';

const KYLE_UID = "451565579401428993"


function GetRandomLine(lines){
  return lines[Math.floor(Math.random() * lines.length)]
}
function FindAnywhere(msg, test){
  return msg.toLowerCase().includes(test.toLowerCase());
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

let connection;

// Listen and respond to messages 
client.on('messageCreate', message => { 

  if (message.author.id === KYLE_UID){ //kyle
    message.react("👎");
  }

  // Ignore messages from bots 
  if (message.author.bot) return;

  //ignore messages not meant for beatrice
  if (!FindAnywhere(message.content, 'beatrice'))
    if (!message.mentions.has(client.user))
      return;

  ReactToMessage(message);
});

function ReactToMessage(message){
  // Respond to a specific message 
  if (FindAnywhere(message.content, 'help')) { 
    message.reply(GetRandomLine(HELP_RESPONSES)); 
  }
  else if (FindAnywhere(message.content, 'rude')) { 
    message.reply(GetRandomLine(RUDE_RESPONSES));
  }
  else if (FindAnywhere(message.content, 'legal advice')){
    message.reply(GetRandomLine(LEGAL_ADVICE));
  }
  else if (FindAnywhere(message.content, 'gimmie advice')) { 
    const channel = message.member?.voice?.channel; // user’s voice channel

    if (!channel) {
      message.reply(GetRandomLine(BUSY_RESPONSES));
      return;
    }
    

    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    })
    message.reply(GetRandomLine(JOINING_RESPONSES));

  }
  else if (FindAnywhere(message.content, 'fuck off')){
    if (connection) connection.destroy()
  }else{
    message.reply(GetRandomLine(COPYPASTAS))
  }
}

// Log in to Discord using token from .env 
client.login(process.env.DISCORD_TOKEN); 
