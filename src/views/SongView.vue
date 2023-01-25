<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-7xl text-purple-600 border-4 border-purple-600 rounded-full focus:outline-none flex items-center justify-center"
          @click.prevent="newSong(song)"
        >
          <i
            class="fa-solid fa-compact-disc"
            :class="{ '': !isPlaying, 'fa-spin slow-spin': isPlaying }"
          ></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->

          <div class="text-3xl font-bold">
            {{ song.modified_name }}
          </div>

          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{
            $tc("song.comment_count", song.comments_count, { count: song.comments_count })
          }}</span>
          <i class="fa fa-comments float-right text-purple-600 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            v-if="comment_alert_show"
            class="text-white text-center font-semibold rounded p-2 mb-3"
            :class="comment_alert_bg"
          >
            {{ comment_alert_msg }}
          </div>
          <vee-form
            :validation-schema="schema"
            @submit="submitComment"
            v-if="userIsLogin"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-purple-600 block"
              :disabled="comment_in_process"
            >
              {{ $t("song.submit") }}
            </button>
          </vee-form>
          <div
            class="rounded text-white p-3 text-center font-semibold mb-2 bg-purple-600"
            v-else
          >
            <span
              class="underline cursor-pointer text-green-300"
              @click.prevent="toggleAuth"
              >{{ $t("song.create_acc") }}</span
            >
            {{ $t("song.unlock") }}
          </div>
          <!-- Sort Comments -->
          <select
            v-model="sortBy"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-purple-600 rounded pr-2"
          >
            <option value="1">{{ $t("song.latest_com") }}</option>
            <option value="2">{{ $t("song.oldest_com") }}</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortComments">
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-medium text-lg text-purple-600">
            {{ comment.comment_user }}
          </div>
          <timeago class="text-sm" :datetime="new Date(comment.comment_at)" />
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { songCollection, auth, commentCollection } from "@/includes/firebase";
import { mapState, mapWritableState, mapActions } from "pinia";
import useUserStore from "@/stores/user";
import useModalStore from "@/stores/modal";
import usePlayertore from "@/stores/player";

export default {
  data() {
    return {
      song: {},
      schema: {
        comment: "required",
      },
      comment_in_process: false,
      comment_alert_show: false,
      comment_alert_bg: "bg-purple-600",
      comment_alert_msg: "Your comment is submitting. Please wait ...",

      comments: [],
      sortBy: "1",
    };
  },
  computed: {
    ...mapState(useUserStore, ["userIsLogin"]),
    ...mapState(usePlayertore, ["isPlaying"]),
    ...mapWritableState(useModalStore, ["isOpen"]),

    sortComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sortBy === "1") return new Date(b.comment_at) - new Date(a.comment_at);
        return new Date(a.comment_at) - new Date(b.comment_at);
      });
    },
  },
  async created() {
    const songSnapshot = await songCollection.doc(this.$route.params.id).get();

    if (!songSnapshot.exists) {
      this.$router.push({ name: "home" });
      return;
    }

    const { sortBy } = this.$route.query;

    this.sortBy = sortBy === "1" || sortBy === "2" ? sortBy : "1";

    this.song = songSnapshot.data();
    this.song.modified_name = this.song.modified_name.replace(".mp3", "");

    this.fetchComments();
  },
  methods: {
    ...mapActions(usePlayertore, ["newSong"]),
    async submitComment(values, { resetForm }) {
      this.comment_in_process = true;
      this.comment_alert_show = true;
      this.comment_alert_bg = "bg-purple-600";
      this.comment_alert_msg = "Your comment is submitting. Please wait ...";

      const commentDetails = {
        content: values.comment,
        comment_at: new Date().toString(),
        song_id: this.$route.params.id,
        comment_user: auth.currentUser.displayName,
        user_id: auth.currentUser.uid,
      };

      await commentCollection.add(commentDetails);

      this.song.comments_count += 1;
      await songCollection
        .doc(this.$route.params.id)
        .update({ comments_count: this.song.comments_count });

      this.fetchComments();

      this.comment_in_process = false;
      this.comment_alert_show = true;
      this.comment_alert_bg = "bg-green-600";
      this.comment_alert_msg = "Your comment is submitted";

      setTimeout((_) => {
        this.comment_alert_show = false;
      }, 3000);

      resetForm();
    },
    toggleAuth() {
      this.isOpen = true;
    },
    async fetchComments() {
      const snapshots = await commentCollection
        .where("song_id", "==", this.$route.params.id)
        .get();

      this.comments = [];

      snapshots.forEach((doc) => {
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    },
  },
  watch: {
    sortBy(newVal) {
      this.$router.push({
        query: {
          sortBy: newVal,
        },
      });
    },
  },
};
</script>
