// src/context/AuthProvider.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { auth, googleProvider } from "../firebase";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [token, setToken] = useState(null);          // ← NEW

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();   // ← NEW
          setToken(idToken);                       // ← NEW

          const res = await axios.post(
            "http://localhost:5000/api/users/sync",
            { email: user.email },
            { headers: { Authorization: `Bearer ${idToken}` } } // optional
          );
          setRole(res.data.role);
        } catch (error) {
          console.error("Role sync error:", error);
        }
        setCurrentUser(user);
        setPhotoURL(user.photoURL || null);
        setDisplayName(user.displayName || null);
      } else {
        setCurrentUser(null);
        setRole("user");
        setPhotoURL(null);
        setDisplayName(null);
        setToken(null);                            // ← NEW
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      await axios.post(
        "http://localhost:5000/api/users/sync",
        { email: user.email },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const value = {
    currentUser,
    role,
    login,
    signup,
    logout,
    loginWithGoogle,
    loading,
    photoURL,
    displayName,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};