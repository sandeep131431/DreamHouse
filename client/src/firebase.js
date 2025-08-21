// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: 'AIzaSyCHcLHQLyrMLD6wagcAtm0OWaN88de7U6k',

  authDomain: "dream-homes-54008.firebaseapp.com",
  projectId: "dream-homes-54008",
  storageBucket: "dream-homes-54008.appspot.com",
  messagingSenderId: "432172093659",
  appId: "1:432172093659:web:bcbf80a6c2eb54801e3cfe"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);