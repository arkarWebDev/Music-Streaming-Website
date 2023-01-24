<template>
  <div class="fixed bottom-0 w-full">
    <div class="bg-purple-600 rounded px-4 py-2 my-1 mx-auto w-3/6">
      <!-- Track Info -->
      <div class="text-center text-white" v-if="songInfo.modified_name">
        <span class="song-title font-semibold">{{ songInfo.modified_name }}</span> by
        <span class="song-artist">{{ songInfo.genre }}</span>
      </div>
      <div class="flex flex-nowrap gap-4 items-center text-white">
        <!-- Play/Pause Button -->
        <button type="button" @click.prevent="toggleAudio">
          <i
            class="fa text-xl"
            :class="{ 'fa-play': !isPlaying, 'fa-pause': isPlaying }"
          ></i>
        </button>
        <!-- Current Position -->
        <div class="player-currenttime">{{ seek }}</div>
        <!-- Scrub Container  -->
        <div
          class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
          @click="updateSeekPosition"
        >
          <!-- Player Ball -->
          <span
            class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
            :style="{ left: progressBarPercent }"
          >
            <i class="fas fa-circle text-green-400"></i>
          </span>
          <!-- Player Progress Bar-->
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-300"
            :style="{ width: progressBarPercent }"
          ></span>
        </div>
        <!-- Duration -->
        <div class="player-duration">{{ duration }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import usePlayerStore from "@/stores/player";

export default {
  name: "Player",
  computed: {
    ...mapState(usePlayerStore, [
      "isPlaying",
      "seek",
      "duration",
      "songInfo",
      "progressBarPercent",
    ]),
  },
  methods: {
    ...mapActions(usePlayerStore, ["toggleAudio", "updateSeekPosition"]),
  },
};
</script>
