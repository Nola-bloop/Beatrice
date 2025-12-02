// Import required modules
import { exec } from 'child_process';
import dotenv from "dotenv"; dotenv.config();
import fs from 'fs';
import path from "path";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus, VoiceConnectionStatus } from "@discordjs/voice";
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
  facts as FACTS,
} from './resources/responses.js';

import {
  uncategorized as UNCATEGORIZED_POLLS,
} from './resources/polls.js';

import {
  songs as SONGS,
} from './resources/videos.js';

const KYLE_UID = "451565579401428993"
const GOJI_UID = "703622228864139305"

function GetRandomLine(lines){
  return lines[Math.floor(Math.random() * lines.length)]
}
function FindAnywhere(msg, test){
  return msg.toLowerCase().includes(test.toLowerCase());
}
function GetRandomPoll(pollList){
  return pollList[Math.floor(Math.random() * pollList.length)]
}
function GetRandomVideoURL(videoList){
  return videoList[Math.floor(Math.random() * videoList.length)].url
}


// Create a new Discord client with message intent 
const client = new Client({ 
  intents: [ 
      GatewayIntentBits.Guilds,  
      GatewayIntentBits.GuildMessages,  
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessagePolls,
    ] 
}); 

//load commands
client.commands = new Collection();
const commandsPath = path.join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = (await import(`file://${filePath}`)).default;

    client.commands.set(command.data.name, command);
}


// Bot is ready 
client.once('ready', () => { 
  console.log(`🤖 Logged in as ${client.user.tag}`); 
});

let connection;

//commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error!', ephemeral: true });
  }
});


// Listen and respond to messages 
client.on('messageCreate', message => { 

  if (message.author.id === KYLE_UID){ //kyle
    message.react("👎"); return
  }
  if (message.author.id === GOJI_UID){ //kyle
    message.react("👍");
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
  else if (FindAnywhere(message.content, 'fact')){
    message.reply(GetRandomLine(FACTS))
  }
  else if (FindAnywhere(message.content, 'poll')){
    message.channel.send(GetRandomPoll(UNCATEGORIZED_POLLS))
  }
  else if (FindAnywhere(message.content, 'gimmie advice')) { 
    const channel = message.member?.voice?.channel; // user’s voice channel

    if (!channel) {
      message.reply(GetRandomLine(BUSY_RESPONSES));
      return;
    }
    message.reply(GetRandomLine(JOINING_RESPONSES));



    exec("yt-dlp -P ./assets/audio/ --force-overwrites -o current-audio.mp3 -t mp3 " + GetRandomVideoURL(SONGS), (error, stdout, stderr) => {
      console.log(
        "error : `"+error+"`\n" +
        "stdout : `"+stdout+"`\n" +
        "stderr : `"+stderr+"`"
      )
      

      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
      })
      

      const resource = createAudioResource("./assets/audio/current-audio.mp3");

      connection.subscribe(player);
      player.play(resource);

      player.on(AudioPlayerStatus.Idle, () => {
        setTimeout(() => Disconnect(), 1_000);
      });
    })

    
  }
  else if (FindAnywhere(message.content, 'fuck off')){
    Disconnect();
  }
  else if (FindAnywhere(message.content, 'debug-pwd')){
    exec("pwd", function (error, stdout, stderr){
      message.reply(
          "error : `"+error+"`\n" +
          "stdout : `"+stdout+"`\n" +
          "stderr : `"+stderr+"`"
      )
    })
  }
  else{
    message.reply(GetRandomLine(COPYPASTAS))
  }
}

function Disconnect(){
  if (connection?.state != VoiceConnectionStatus.Disconnected){
    connection?.destroy()
    connection = undefined
  }
}

// Log in to Discord using token from .env 
client.login(process.env.DISCORD_TOKEN); 
