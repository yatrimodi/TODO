// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_GiD-kOzds-FJ_j54veHYR3P52byo_VY",
  authDomain: "todo-app-f8cae.firebaseapp.com",
  projectId: "todo-app-f8cae",
  storageBucket: "todo-app-f8cae.appspot.com",
  messagingSenderId: "487760377896",
  appId: "1:487760377896:ios:5459eaba337096a2d0dd1d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
