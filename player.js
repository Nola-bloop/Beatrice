const module = {
 	Play : (con, audioFile) => {
 		let player = createAudioPlayer();
 		const resource = createAudioResource(`./assets/audio/${audioFile}`);

 		con.subscribe(player);
		player.play(resource);

		return player
 	},
 	Download : (url, name) => {
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
 	ClearDownloads : () => {
 		exec(`rm -r ./assets/audio/*`, (error, stdout, stderr) => {
	    	console.log(
		        "error : `"+error+"`\n" +
		        "stdout : `"+stdout+"`\n" +
		        "stderr : `"+stderr+"`"
	    	)
	  	})
 	},
 	//[{"url":"abc","text":"123"}]
 	PlayMultiple : async (con, songs) => {
 		let fileName = await module.Download(songs[0].url, songs[0].name)
 		let player = module.Play(con, fileName)
 		player.on(AudioPlayerStatus.Idle, () => {

 			songs.shift()
 			if (songs.length > 0) module.PlayMultiple(con, songs)
 			else if (con?.state != VoiceConnectionStatus.Disconnected){
				con?.destroy()
			}
		});
 	}
}
export default module