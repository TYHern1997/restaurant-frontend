// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAB_803LBPCdvK-X_tc1URIZ6CJqeUwq6Y",
    authDomain: "twitter-app-394ba.firebaseapp.com",
    projectId: "twitter-app-394ba",
    storageBucket: "twitter-app-394ba.firebasestorage.app",
    messagingSenderId: "1010935034482",
    appId: "1:1010935034482:web:76eac8d8f70def4fb3c8eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);