<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-if="!inEditMode" class="flex items-center justify-between">
      <div>
        <h6 class="inline-block text-medium font-semibold">
          {{ song.modified_name }}
        </h6>
        <p class="text-sm text-purple-500">
          Genre : <span class="text-gray-400">{{ song.genre }}</span>
        </p>
      </div>
      <div class="text-xl cursor-pointer">
        <i
          class="fa fa-pencil-alt text-purple-600"
          @click.prevent="inEditMode = !inEditMode"
        ></i>
        <i class="fa-solid fa-ban mx-2 text-red-600" @click.prevent="deleteSong"></i>
      </div>
    </div>
    <div v-else>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <div
          v-show="showAlert"
          :class="alert_bg"
          class="text-white text-center text-medium rounded p-2 mb-2"
        >
          {{ alert_message }}
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="unsavedFlagCheck(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="unsavedFlagCheck(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <div class="flex items-center justify-between">
          <button type="submit" class="py-1.5 px-3 rounded text-white bg-purple-600">
            Submit
          </button>
          <button
            type="button"
            @click.prevent="goBack"
            class="py-1.5 px-3 rounded text-purple-600 border-purple-600"
          >
            Back
          </button>
        </div>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { ErrorMessage } from "vee-validate";
import { songCollection, storage } from "@/includes/firebase";

export default {
  name: "Composition",
  data() {
    return {
      inEditMode: false,
      schema: {
        modified_name: "song_title",
        genre: "alpha_spaces",
      },
      showAlert: false,
      alert_bg: "",
      alert_message: "",
    };
  },
  props: {
    song: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    updateUI: {
      type: Function,
      required: true,
    },
    updateUiAfterDelete: {
      type: Function,
      required: true,
    },
    unsavedFlagCheck: {
      type: Function,
    },
  },
  mounted() {
    this.song.modified_name = this.song.modified_name.replace(".mp3", "");
  },
  components: { ErrorMessage },
  emits: ["deleteSuccessMsg"],
  methods: {
    async edit(values) {
      this.alert_message = "Updating in progress ...";
      this.showAlert = true;

      try {
        await songCollection.doc(this.song.docID).update(values);
      } catch (error) {
        this.alert_bg = "bg-red-600";
        this.alert_message = "Something went wrong. Try again later";
        setTimeout(() => {
          this.showAlert = false;
          this.inEditMode = false;
        }, 3000);
        return;
      }

      this.alert_bg = "bg-green-600";
      this.alert_message = "Updated successfully.";
      this.updateUI(this.index, values);
      this.unsavedFlagCheck(false);

      setTimeout(() => {
        this.showAlert = false;
        this.inEditMode = false;
      }, 3000);
    },
    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);

      await songRef.delete();

      await songCollection.doc(this.song.docID).delete();

      this.updateUiAfterDelete(this.index);

      this.$emit("deleteSuccessMsg");
    },
    goBack() {
      this.unsavedFlagCheck(false);
      this.inEditMode = false;
    },
  },
};
</script>
