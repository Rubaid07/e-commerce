// src/context/AuthProvider.jsx - COMPLETE FIXED VERSION
import { useEffect, useState } from "react";
import axios from "axios";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { auth, googleProvider } from "../firebase";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [photoURL, setPhotoURL] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          setToken(idToken);

        
          const res = await axios.post(
            "http://localhost:5000/api/users/sync",
            { 
              email: user.email,
              name: user.displayName || user.email.split('@')[0]
            },
            { 
              headers: { 
                Authorization: `Bearer ${idToken}` 
              } 
            }
          );
          
          setRole(res.data.role);
        } catch (error) {
          // console.error("Role sync error:", error);
        }
        
        setCurrentUser(user);
        setPhotoURL(user.photoURL || null);
        setDisplayName(user.displayName || null);
        
        // Local storage-এ token সেভ করুন (optional)
        localStorage.setItem('authToken', token);
      } else {
        setCurrentUser(null);
        setRole("user");
        setPhotoURL(null);
        setDisplayName(null);
        setToken(null);
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

const signup = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, {
      displayName: name
    });
    
    const idToken = await user.getIdToken();
    setToken(idToken);
    
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/sync",
        { 
          email: user.email,
          name: name
        },
        { 
          headers: { 
            Authorization: `Bearer ${idToken}` 
          } 
        }
      );
      
      setRole(res.data.role);
      
    } catch (backendError) {
      // console.error("Backend sync failed but Firebase user created:", backendError);
    }
    
    setCurrentUser({
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: user.photoURL
    });
    
    return user;
    
  } catch (error) {
    // console.error("Signup error:", error.code, error.message);
    
    // Specific error handling
    if (error.code === 'auth/email-already-in-use') {
      // console.log("User already exists, attempting to login...");
      throw new Error("This email is already registered. Please login instead.");
      
    } else if (error.code === 'auth/weak-password') {
      throw new Error("Password is too weak. Please use a stronger password.");
      
    } else if (error.code === 'auth/invalid-email') {
      throw new Error("Invalid email address.");
      
    } else {
      throw error;
    }
  }
};

  const logout = () => signOut(auth);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      setToken(idToken);
      
      await axios.post(
        "http://localhost:5000/api/users/sync",
        { 
          email: user.email,
          name: user.displayName || user.email.split('@')[0]
        },
        { 
          headers: { 
            Authorization: `Bearer ${idToken}` 
          } 
        }
      );
      
      // Local state update
      setCurrentUser(user);
      setPhotoURL(user.photoURL);
      setDisplayName(user.displayName);
      
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
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