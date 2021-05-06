import firebase from 'firebase'
import 'firebase/storage'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);

  const storage = app.storage();
  const fireStore = app.firestore();
  const auth = app.auth();
  // const timestamp = app.firestore.FieldValue.serverTimestamp

//   export {projectStorage, projectFireStore, timestamp}
  export  {storage, fireStore, auth};