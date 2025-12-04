import util from "util";
import { exec } from "child_process";

const execAsync = util.promisify(exec);

const module = {
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
 		await execAsync(`rm -r ./assets/audio/*`, (error, stdout, stderr) => {
 			if (error) console.log(error)
	  	})
 	},
 	DownloadQueue : async (res) => {
 		await module.ClearDownloads();

	    const processNext = async () => {
	        if (module.queue.length === 0) {
	            return;
	        }

	        let song = module.queue[0];

	        // Already downloaded?
	        if (module.ListFind(module.downloads, song.name) !== -1) {
	            module.queue.shift();
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
	        module.downloads.push({
	            name: song.name,
	            url: song.url,
	            fileName: `${song.name}.mp3`,
	        });

	        // Remove from queue
	        module.queue.shift();

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
	        if (songsPlayed >= waitFor && module.downloads.length === 0) {
	            return; 
	        }

	        // if nothing to play yet, wait and retry
	        if (module.downloads.length === 0) {
	            setTimeout(playNext, 250);
	            return;
	        }

	        let next = module.downloads[0];
	        res(`Playing ${song.name}`)
	        let player = module.PlayFile(con, next.fileName);

	        player.on(AudioPlayerStatus.Idle, () => {
	            module.downloads.shift();
	            songsPlayed++;
	            playNext(); // recursion, no loop needed
	        });
	    };

	    playNext();
 	},
 	//[{"url":"abc","name":"123"}]
 	PlayList : (con, songs, res) => {

 		songs.forEach(song => {
 			module.queue.push(song)
 		})
 		module.DownloadQueue(res)
 		module.PlayDownloads(con, module.queue.length, res)
 	}
}
export default module