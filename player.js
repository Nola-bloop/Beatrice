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
 	ClearDownloads : () => {
 		exec(`rm -r ./assets/audio/*`, (error, stdout, stderr) => {
	    	console.log(
		        "error : `"+error+"`\n" +
		        "stdout : `"+stdout+"`\n" +
		        "stderr : `"+stderr+"`"
	    	)
	  	})
 	},
 	async DownloadQueue : () => {
 		while (module.queue.length != 0){
 			let song = module.queue[0]
 			if (ListFind(module.downloads,module.song.name)){
 				queue.shift()
 			}else{
 				await execAsync(`yt-dlp -P ./assets/audio/ --force-overwrites -o '${song.name}.mp3' -t mp3 ${song.url}`)
 				let downloadObj = {
 					name:`${song.name}`,
 					url:`${song.url}`,
 					fileName:`${song.name}.mp3`
 				}
 				module.downloads.push(downloadObj)
 			}
 		}
 	},
 	async PlayDownloads : (con, waitFor) => {
 		let songsPlayed = 0;
 		const playNext = () => {
	        // stop condition
	        if (songsPlayed >= waitFor && this.downloads.length === 0) {
	            return; 
	        }

	        // if nothing to play yet, wait and retry
	        if (this.downloads.length === 0) {
	            setTimeout(playNext, 250);
	            return;
	        }

	        let next = this.downloads[0];
	        let player = this.PlayFile(con, next.fileName);

	        player.on(AudioPlayerStatus.Idle, () => {
	            this.downloads.shift();
	            songsPlayed++;
	            playNext(); // recursion, no loop needed
	        });
	    };

	    playNext();
 	},
 	//[{"url":"abc","name":"123"}]
 	PlayList : async (con, songs) => {

 		songs.forEach(song => {
 			module.queue.push(song)
 		})
 		DownloadQueue()
 		PlayDownloads(con, module.queue.length)
 	}
}
export default module