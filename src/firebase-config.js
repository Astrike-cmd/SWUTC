import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAA52r27z-WFbfW8oaKy1zS5epsmy1igko",
  authDomain: "swutc-16.firebaseapp.com",
  projectId: "swutc-16",
  storageBucket: "swutc-16.firebasestorage.app",
  messagingSenderId: "571021231476",
  appId: "1:571021231476:web:c14f4b39cb2e052ddc1821"
};

// eslint-disable-next-line
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);