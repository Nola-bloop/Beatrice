import util from "util";
import { exec } from "child_process";
import {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} from "@discordjs/voice";

const execAsync = util.promisify(exec);

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

  async _downloader(res) {
    while (this.queue.length > 0) {
      const song = this.queue.shift();

      if (this.downloads.some(d => d.name === song.name)) {
        // Already downloaded — skip
        song.deferred.resolve();
        this.downloads.push(song);
        continue;
      }

      res(`Downloading ${song.name}`);
      try {
        await execAsync(
          `yt-dlp -P ./assets/audio/ --force-overwrites -o "${song.name}.mp3" -f mp3 ${song.url}`
        );
        song.fileName = `${song.name}.mp3`;
        this.downloads.push(song);
        song.deferred.resolve();
        res(`Finished downloading ${song.name}`);
      } catch (err) {
        song.deferred.reject(err);
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

  async playAll(con, res) {
    // Start the downloader in background (non-blocking)
    this._downloader(res).catch(err => {
      console.error("Downloader error:", err);
    });

    // Play the songs in the order they were enqueued
    for (const song of this.downloads.concat(this.queue)) {
      // Wait until this song is downloaded
      await song.deferred.promise;

      res(`Playing ${song.name}`);
      const player = this.playFile(con, song.fileName);

      // Wait until end
      await new Promise((playResolve) => {
        player.once(AudioPlayerStatus.Idle, () => {
          playResolve();
        });
      });
      // Then loop to next song
    }

    res("Playlist finished.");
  },

  // Public API
  async PlayList(con, songs, res) {
    this.enqueue(songs);
    await this.playAll(con, res);
  },

  async ClearDownloads() {
    await execAsync(`rm -rf ./assets/audio/*`);
    this.queue = [];
    this.downloads = [];
  }
};

export default music;
