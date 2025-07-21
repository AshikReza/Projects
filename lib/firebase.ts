import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8RjYfFt1btBdqzPhnp4pm9SFehTaUJjU",
  authDomain: "dopamine-diary.firebaseapp.com",
  projectId: "dopamine-diary",
  storageBucket: "dopamine-diary.firebasestorage.app",
  messagingSenderId: "324935275171",
  appId: "1:324935275171:web:3b6b55fd15f37373b7e516",
  measurementId: "G-41607XF9KS",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };

// -----------------------------------------------

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD8RjYfFt1btBdqzPhnp4pm9SFehTaUJjU",
//   authDomain: "dopamine-diary.firebaseapp.com",
//   projectId: "dopamine-diary",
//   storageBucket: "dopamine-diary.firebasestorage.app",
//   messagingSenderId: "324935275171",
//   appId: "1:324935275171:web:3b6b55fd15f37373b7e516",
//   measurementId: "G-41607XF9KS"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
