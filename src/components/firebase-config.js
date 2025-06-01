import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBu1jni3kv21TjXVrp7EOG0Zobm9VZzPvQ",
    authDomain: "soilmoisturedetection.firebaseapp.com",
    databaseURL: "https://soilmoisturedetection-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "soilmoisturedetection",
    storageBucket: "soilmoisturedetection.firebasestorage.app",
    messagingSenderId: "1000903035383",
    appId: "1:1000903035383:web:4a2706b7cd549cf05746f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app)
