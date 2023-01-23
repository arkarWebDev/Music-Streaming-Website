import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig = {
  apiKey: "youe_Api_key",
  authDomain: "example.firebaseapp.com",
  projectId: "example",
  storageBucket: "example.appspot.com",
  messagingSenderId: "00000000",
  appId: "0:00000000:web:0x0x0x0x0x0x0",
  measurementId: "A-00000000",
};

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const userCollection = db.collection("users");
const songCollection = db.collection("songs");
const commentCollection =db.collection("comments");

export{
    auth,db,userCollection,storage,songCollection,commentCollection
}