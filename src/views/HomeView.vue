<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Develop by Htoo Arkar Linn. Host by firebase. Source Code are in my github.
          <br />
          <a
            href="https://github.com/arkarWebDev/Music-Streaming-Website"
            class="underline"
            >Click for Source Code</a
          >
        </p>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="/assets/img/introduction-music.png"
    />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto mb-24">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title text-xl">Trending Songs</span>
        <!-- Icon -->
        <i class="fa fa-headphones-alt float-right text-purple-600 text-xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <songItem v-for="song in songs" :key="song.docID" :song="song" />
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>

<script>
import { songCollection } from "@/includes/firebase";
import songItem from "@/components/SongItem.vue";

export default {
  data() {
    return {
      songs: [],
      paginateCount: 5,
      isRequestPending: false,
    };
  },
  components: { songItem },
  async created() {
    this.fetchSongs();

    window.addEventListener("scroll", this.handleScrolling);
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScrolling);
  },
  methods: {
    async fetchSongs() {
      if (this.isRequestPending) {
        return;
      }

      this.isRequestPending = true;

      let snapshot;
      if (this.songs.length) {
        const lastDoc = await songCollection
          .doc(this.songs[this.songs.length - 1].docID)
          .get();
        snapshot = await songCollection
          .orderBy("modified_name")
          .startAfter(lastDoc)
          .limit(this.paginateCount)
          .get();
      } else {
        snapshot = await songCollection
          .orderBy("modified_name")
          .limit(this.paginateCount)
          .get();
      }

      snapshot.forEach((doc) => {
        this.songs.push({
          docID: doc.id,
          ...doc.data(),
        });
      });

      this.isRequestPending = false;
    },
    handleScrolling() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const reachBottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (reachBottomOfWindow) {
        this.fetchSongs();
      }
    },
  },
};
</script>
