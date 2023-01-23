<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title text-xl">Upload</span>
      <i class="fas fa-upload float-right text-purple-600 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded font-bold text-center cursor-pointer border border-dashed border-purple-600 text-gray-400 transition duration-500 hover:text-white hover:bg-purple-600 hover:border-purple-600 hover:border-solid"
        :class="{ 'text-white bg-purple-600 border-purple-600 border-solid': isDragging }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragging = false"
        @dragover.prevent.stop="isDragging = true"
        @dragenter.prevent.stop="isDragging = true"
        @dragleave.prevent.stop="isDragging = false"
        @drop.prevent.stop="uploadMusic($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="uploadMusic($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4 flex items-center" v-for="upload in uploads" :key="upload.name">
        <!-- music icon -->
        <i :class="upload.musicIcon"></i>
        <div class="w-full mx-5">
          <!-- File Name -->
          <div class="font-semibold text-sm mb-1" :class="upload.textColor">
            {{ upload.name.replace(".mp3", "") }}
          </div>
          <div class="flex h-2 overflow-hidden bg-gray-300 rounded">
            <!-- Inner Progress Bar -->
            <div
              v-if="upload.current_upload_status != 100"
              class="transition-all progress-bar"
              :class="upload.progerssBarBg"
              :style="{ width: upload.current_upload_status + '%' }"
            ></div>
            <div
              v-else
              class="transition-all"
              :class="upload.progerssBarBg"
              :style="{ width: upload.current_upload_status + '%' }"
            ></div>
          </div>
        </div>
        <i :class="upload.uploadingIcon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, songCollection, auth } from "@/includes/firebase";

export default {
  name: "Upload",
  data() {
    return {
      isDragging: false,
      uploads: [],
    };
  },
  props: {
    updateUiAfterAddSong: {
      type: Function,
    },
  },
  methods: {
    uploadMusic($event) {
      this.isDragging = false;

      let files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          return;
        }

        const storageRef = storage.ref(); // vuetify-b0e14.appspot.com
        const songsRef = storageRef.child(`songs/${file.name}`);
        const response = songsRef.put(file);

        let uploadIndex =
          this.uploads.push({
            response,
            current_upload_status: 0,
            name: file.name,
            musicIcon: "fa-regular fa-file-audio text-4xl text-purple-600",
            uploadingIcon: "fa fa-spinner fa-spin text-xl text-gray-500",
            progerssBarBg: "bg-purple-600",
            textColor: "text-gray-400",
          }) - 1;

        response.on(
          "state_changed",
          (snapShot) => {
            const uploadStatus = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
            this.uploads[uploadIndex].current_upload_status = uploadStatus;
          },
          (error) => {
            this.uploads[uploadIndex].musicIcon =
              "fa-regular fa-file-audio text-4xl text-gray-600";
            this.uploads[uploadIndex].uploadingIcon =
              "fa fa-circle-info text-xl text-red-600";
            this.uploads[uploadIndex].progerssBarBg = "bg-red-600";
            this.uploads[uploadIndex].textColor = "text-gray-500";
          },
          async () => {
            const songInfo = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: response.snapshot.ref.name,
              modified_name: response.snapshot.ref.name,
              genre: "Unknown",
              comments_count: 0,
            };

            songInfo.url = await response.snapshot.ref.getDownloadURL();
            const songRef = await songCollection.add(songInfo);
            const songSnapshot = await songRef.get();

            this.updateUiAfterAddSong(songSnapshot);

            this.uploads[uploadIndex].musicIcon =
              "fa-regular fa-file-audio text-4xl text-gray-600";
            this.uploads[uploadIndex].uploadingIcon =
              "fa fa-circle-check text-xl text-green-600";
            this.uploads[uploadIndex].progerssBarBg = "bg-green-600";
            this.uploads[uploadIndex].textColor = "text-gray-500";
          }
        );
      });
    },
  },
};
</script>
