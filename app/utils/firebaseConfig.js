import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyCuf4bKxyrSXgxJExwMx-7MUpcMpCyHXbM",
  authDomain: "music-upload-kyle.firebaseapp.com",
  projectId: "music-upload-kyle",
  storageBucket: "music-upload-kyle.appspot.com",
  messagingSenderId: "952808664139",
  appId: "1:952808664139:web:c8595fe595fba286edb1ce",
});

const storage = getStorage(app);
export default storage;
