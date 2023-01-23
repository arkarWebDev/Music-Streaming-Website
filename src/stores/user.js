import { defineStore } from "pinia";
import { auth, userCollection } from "@/includes/firebase";

export default defineStore("user", {
  state: () => ({
    userIsLogin: false,
  }),
  actions: {
    async register(values) {
      const userCred = await auth.createUserWithEmailAndPassword(values.email, values.password);

      await userCollection.doc(userCred.user.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      });

      await userCred.user.updateProfile({
        displayName : values.name,
      });

      this.userIsLogin = true;
    },
    async login(values){
      await auth.signInWithEmailAndPassword(values.email,values.password);

      this.userIsLogin = true;

      window.location.reload();
    },
    async logout(){
      await auth.signOut();
      
      this.userIsLogin = false;

      window.location.reload()
    }
  },
});
