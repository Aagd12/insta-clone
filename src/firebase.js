import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseApp = initializeApp({
  apiKey: "AIzaSyAyULf8cubq9lMjPN6ORPiVPLUcf-0v-4c",
  authDomain: "instagram-clone-92f47.firebaseapp.com",
  databaseURL: "https://instagram-clone-92f47-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-92f47",
  storageBucket: "instagram-clone-92f47.appspot.com",
  messagingSenderId: "996233783536",
  appId: "1:996233783536:web:f84c8048f1afe295ef3a35",
  measurementId: "G-0VKP4ZLT5T",
});
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
export { db, auth, storage };
