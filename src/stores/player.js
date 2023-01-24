import { defineStore } from "pinia";
import { Howl } from "howler";
import customHelper from "@/includes/helper";

export default defineStore("player", {
  state: () => ({
    songInfo: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    progressBarPercent: "0%",
  }),
  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) this.sound.unload();
      this.songInfo = song;
      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });
      this.sound.play();

      this.sound.on("play", (_) => {
        requestAnimationFrame(this.progress);
      });
    },
    async toggleAudio() {
      if (!this.sound.playing) return;
      if (this.sound.playing()) this.sound.pause();
      else this.sound.play();
    },
    progress() {
      this.seek = customHelper.formatTime(this.sound.seek());
      this.duration = customHelper.formatTime(this.sound.duration());

      this.progressBarPercent = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;

      if (this.sound.playing()) requestAnimationFrame(this.progress);
      console.log("i am progress function")
    },
    async updateSeekPosition(event) {
      if (!this.sound.playing) return;

      const { x, width } = event.currentTarget.getBoundingClientRect();

      const clickX = event.clientX - x;
      const percent = clickX / width;
      const sec = this.sound.duration() * percent;
      this.sound.seek(sec);
      await this.toggleAudio()
      this.sound.once("seek", this.progress);
    },
  },
  getters: {
    isPlaying: (state) => {
      if (state.sound.playing) return state.sound.playing();
      else return false;
    },
  },
});
