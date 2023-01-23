<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <manage-upload :updateUiAfterAddSong="updateUiAfterAddSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title text-xl">Songs List</span>
            <i class="fa fa-compact-disc float-right text-purple-600 text-2xl"></i>
          </div>
          <div class="p-6">
            <div
              v-show="isDeleteSuccessMsg"
              class="mb-4 bg-red-600 flex items-center justify-between text-white py-2 px-3 rounded"
            >
              <span>Deleted Successfully !</span
              ><i
                class="fa-solid fa-xmark cursor-pointer"
                @click="isDeleteSuccessMsg = false"
              ></i>
            </div>
            <!-- Composition Items -->
            <composition-item
              v-for="(song, i) in songs"
              :key="song.docID"
              :song="song"
              :index="i"
              :updateUI="updateUI"
              :updateUiAfterDelete="updateUiAfterDelete"
              :unsavedFlagCheck="unsavedFlagCheck"
              @deleteSuccessMsg="deleteSuccessMsg"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import useUserStore from "@/stores/user";
import ManageUpload from "@/components/ManageUpload.vue";
import CompositionItem from "@/components/CompositionItem.vue";
import { auth, songCollection } from "@/includes/firebase";

export default {
  name: "Manage",
  data() {
    return {
      songs: [],
      isDeleteSuccessMsg: false,
      unsavedFlag: false,
    };
  },
  components: {
    ManageUpload,
    CompositionItem,
  },
  async created() {
    let snapshot = await songCollection.where("uid", "==", auth.currentUser.uid).get();

    snapshot.forEach(this.updateUiAfterAddSong);
  },
  beforeRouteEnter(to, from, next) {
    let user = useUserStore();

    if (user.userIsLogin) {
      next();
    } else {
      next({ name: "home" });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const confirmLeave = confirm("Are you sure to leave this page ?");
      next(confirmLeave);
    }
  },
  methods: {
    updateUI(index, values) {
      this.songs[index].modified_name = values.modified_name;
      this.songs[index].genre = values.genre;
    },
    updateUiAfterDelete(index) {
      this.songs.splice(index, 1);
    },
    deleteSuccessMsg() {
      this.isDeleteSuccessMsg = true;
    },
    updateUiAfterAddSong(doc) {
      let song = {
        ...doc.data(),
        docID: doc.id,
      };

      this.songs.push(song);
    },
    unsavedFlagCheck(status) {
      this.unsavedFlag = status;
    },
  },
};
</script>
