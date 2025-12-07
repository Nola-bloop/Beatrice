import util from "util";
import { exec, spawn } from "child_process";
import {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType
} from "@discordjs/voice";
const execAsync = util.promisify(exec);

function streamWithYtDlp(con, url) {
  const ytdlp = spawn("yt-dlp", [
    "--cookies", "./cookies.txt",
    "-f", "bestaudio",
    "-o", "-",
    url
  ]);

  const resource = createAudioResource(ytdlp.stdout, {
    inputType: StreamType.Arbitrary
  });

  const player = createAudioPlayer();
  con.subscribe(player);
  player.play(resource);

  return { player, process: ytdlp };
}

function makeDeferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const music = {
  queue: [],           // all songs to queue (objects: { name, url, _deferred })
  downloads: [],       // same songs, after downloaded

  enqueue(songs) {
    for (const s of songs) {
      const deferred = makeDeferred();
      this.queue.push({ name: s.name, url: s.url, deferred });
    }
  },

  async _downloader() {
    while (this.queue.length > 0) {
      const song = this.queue[0];

      if (this.downloads.some(d => d.name === song.name)) {
        // Already downloaded — skip
        song.deferred.resolve();
        this.downloads.push(song);
        continue;
      }

      console.log(`Downloading ${song.name}`);
      try {
        await execAsync(
          `yt-dlp -P ./assets/audio/ --cookies ./.cookies.txt --user-agent "Mozilla/5.0" --referer "https://www.youtube.com/" --force-overwrites -o "${song.name}.m4a" -f m4a ${song.url}`
        );
        song.fileName = `${song.name}.m4a`;
        this.downloads.push(song);
        this.queue.shift()
        song.deferred.resolve();
        console.log(`Finished downloading ${song.name}`);
      } catch (err) {
        song.deferred.reject(err);
        this.queue.shift()
        console.error(`Failed to download ${song.name}`, err);
      }
    }
  },

  playFile(con, fileName) {
    const player = createAudioPlayer();
    const resource = createAudioResource(`./assets/audio/${fileName}`);
    con.subscribe(player);
    player.play(resource);
    return player;
  },

  async playAll(con) {
    // Start the downloader in background (non-blocking)
    this._downloader().catch(err => {
      console.error("Downloader error:", err);
    });

    // Play the songs in the order they were enqueued
    for (const song of this.downloads.concat(this.queue)) {
      // Wait until this song is downloaded
      await song.deferred.promise;

      console.log(`Playing ${song.name}`);
      const player = this.playFile(con, song.fileName);

      // Wait until end
      await new Promise((playResolve) => {
        player.once(AudioPlayerStatus.Idle, () => {
          playResolve();
        });
      });
      // Then loop to next song
    }

    console.log("Playlist finished.");
  },

  // Public API
  async PlayList(con, songs) {
    this.enqueue(songs);
    await this.playAll(con);
  },

  async ClearDownloads() {
    await execAsync(`rm -rf ./assets/audio/*`);
    this.queue = [];
    this.downloads = [];
  },
  PlayTest : async (con) => {
    // const player = createAudioPlayer();

    // const url = "https://www.youtube.com/watch?v=xGGtN5XMOiI";

    // play.setToken({ youtube: { cookie: "" } });

    // const { stream } = await play.stream_from_info(
    //   await play.video_info(url),
    //   { quality: 2 }
    // );

    // const resource = createAudioResource(stream, {
    //   inputType: StreamType.Arbitrary,
    // });

    // player.play(resource);
    // con.subscribe(player);

    // return player;
    streamWithYtDlp(con, "https://www.youtube.com/watch?v=xGGtN5XMOiI")
  }
};

export default music;
