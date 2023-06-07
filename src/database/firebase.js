import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import { getFirestore, initializeFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB5zC3jLoV2KX3FWBBYqKEDdeyZEEjKd6E",
  authDomain: "hack-4-impact.firebaseapp.com",
  projectId: "hack-4-impact",
  storageBucket: "hack-4-impact.appspot.com",
  messagingSenderId: "420368044967",
  appId: "1:420368044967:web:d9751e49af5c1c00b31c82"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const firestoreSettings = {
  useFetchStreams: false,
  experimentalForceLongPolling: true,
}
const db = initializeFirestore(app, firestoreSettings)


export {auth, db}
