import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD4oPSwZomo0__KdhtlXLQeKsPXBirjHmw",
  authDomain: "e-commerce-2d8e1.firebaseapp.com",
  projectId: "e-commerce-2d8e1",
  storageBucket: "e-commerce-2d8e1.firebasestorage.app",
  messagingSenderId: "768477948368",
  appId: "1:768477948368:web:9c490d3c50a8c14e80b1d5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();