// lib/firebase.js
import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}


if (!firebaseConfig.apiKey) {
  throw new Error("Missing Firebase API Key")
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]

console.log(
  "Firebase Config",
  firebaseConfig.apiKey
)

// console.log("APPS ", app)


export const auth = getAuth(app)
export const db = getFirestore(app)

console.log("DB ", db)
