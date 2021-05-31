import firebase from "firebase";
import "firebase/storage";
import "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyBnLYEFDKifJ63PD-rFTzXVixGhr4Wei1w",
  authDomain: "shoppingmall-a2bd5.firebaseapp.com",
  databaseURL: "https://shoppingmall-a2bd5-default-rtdb.firebaseio.com",
  projectId: "shoppingmall-a2bd5",
  storageBucket: "shoppingmall-a2bd5.appspot.com",
  messagingSenderId: "225253520018",
  appId: "1:225253520018:web:528921ee33206e0c8f2c4b",
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const storage = app.storage();
const fireStore = app.firestore();
const auth = app.auth();

export { storage, fireStore, auth };
