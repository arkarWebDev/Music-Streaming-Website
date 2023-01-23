<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <router-link
        :to="{ name: 'play', params: { id: song.docID } }"
        class="font-bold block text-gray-600"
        >{{ song.modified_name }}</router-link
      >
      <span class="text-purple-500 text-sm"
        >artist : <span class="text-gray-500">{{ song.genre }}</span></span
      >
    </div>

    <div class="text-gray-600 text-lg">
      <span class="comments">
        <i class="fa fa-comments text-gray-600"></i>
        {{ song.comments_count }}
      </span>
    </div>
  </li>
</template>

<script>
export default {
  name: "SongItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.song.modified_name = this.song.modified_name.replace(".mp3", "");
  },
};
</script>
