const module = {
 	Play = (con, audioFile) => {
 		let player = createAudioPlayer();
 		const resource = createAudioResource(`./assets/audio/${audioFile}`);

 		con.subscribe(player);
		player.play(resource);

		/*player.on(AudioPlayerStatus.Idle, () => {
			setTimeout(() => Disconnect(), 1_000);
		});*/

		return player
 	},
 	Download = (url, name) => {
 		return new Promise((resolve, reject) => {
 			exec(`yt-dlp -P ./assets/audio/ --force-overwrites -o ${name}.mp3 -t mp3 ${url}`, (error, stdout, stderr) => {
		    	console.log(
			        "error : `"+error+"`\n" +
			        "stdout : `"+stdout+"`\n" +
			        "stderr : `"+stderr+"`"
		    	)

		    	if (!error) resolve(`${name}.mp3`)
		  	}
 		})
 	},
 	ClearDownloads = () => {
 		exec(`rm -r ./assets/audio/*`, (error, stdout, stderr) => {
	    	console.log(
		        "error : `"+error+"`\n" +
		        "stdout : `"+stdout+"`\n" +
		        "stderr : `"+stderr+"`"
	    	)
	  	}
 	},
 	async PlayMultiple = (con, songs) => {
 		let fileName = await module.Download(songs[0].url, songs[0].name)
 		let player = module.Play(con, fileName)
 		player.on(AudioPlayerStatus.Idle, () => {
			PlayMultiple(con, songs.shift())
		}, 1_000);
 	}
}
export default module