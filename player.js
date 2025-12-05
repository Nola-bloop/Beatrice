import util from "util";
import { exec } from "child_process";
import {
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus
} from "@discordjs/voice";

const execAsync = util.promisify(exec);

const playerModule = {
	queue:[],
	downloads:[],
	ListFind : (list,songName) => {
		let obj
		list.forEach((song, k) => {
			if (song.name === songName) obj = k
		})
		return obj
	},
 	PlayFile : (con, audioFile) => {
 		let player = createAudioPlayer();
 		const resource = createAudioResource(`./assets/audio/${audioFile}`);

 		con.subscribe(player);
		player.play(resource);

		return player
 	},
 	ClearDownloads : async () => {
 		await execAsync(`rm -r --interactive=never ./assets/audio/*`)
 	},
 	DownloadQueue : async (res) => {

	    const processNext = async () => {
	        if (playerModule.queue.length === 0) {
	            return;
	        }

	        let song = playerModule.queue[0];

	        // Already downloaded?
	        if (playerModule.ListFind(playerModule.downloads, song.name) !== -1) {
	            playerModule.queue.shift();
	            setImmediate(processNext);
	            return;
	        }

	        // Send response callback
	        res(`Downloading ${song.name}`);

	        // Download file
	        await execAsync(
	            `yt-dlp -P ./assets/audio/ --force-overwrites -o "${song.name}.mp3" -f mp3 ${song.url}`
	        );

	        // Add to downloads
	        playerModule.downloads.push({
	            name: song.name,
	            url: song.url,
	            fileName: `${song.name}.mp3`,
	        });

	        // Remove from queue
	        playerModule.queue.shift();

	        // Continue (non-blocking)
	        setImmediate(processNext);
	    };

	    // Start the downloader
	    processNext();
 	},
 	PlayDownloads : async (con, waitFor, res) => {
 		let songsPlayed = 0;
 		const playNext = () => {
	        // stop condition
	        if (songsPlayed >= waitFor && playerModule.downloads.length === 0) {
	            return; 
	        }

	        // if nothing to play yet, wait and retry
	        if (playerModule.downloads.length === 0) {
	            setTimeout(playNext, 250);
	            return;
	        }

	        let next = playerModule.downloads[0];
	        res(`Playing ${next.name}`)
	        let player = playerModule.PlayFile(con, next.fileName);

	        player.on(AudioPlayerStatus.Idle, () => {
	            playerModule.downloads.shift();
	            songsPlayed++;
	            playNext(); // recursion, no loop needed
	        });
	    };

	    playNext();
 	},
 	//[{"url":"abc","name":"123"}]
 	PlayList : (con, songs, res) => {
 		songs.forEach(song => {
 			playerModule.queue.push(song)
 		})
 		playerModule.DownloadQueue(res)
 		playerModule.PlayDownloads(con, playerModule.queue.length, res)
 	}
}
export default playerModule