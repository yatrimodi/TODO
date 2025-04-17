import { createContext, useContext, useState } from "react";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { auth, db } from "../firebaseConfig"; 
import { doc, setDoc, getDoc, query, where, getDocs, collection } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Signup function with username
  const signup = async (username, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Save user info in Firestore
      await setDoc(doc(db, "users", newUser.uid), { username, email });

      setUser(newUser);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Get Email from Username
  const getEmailFromUsername = async (username) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().email;
    } else {
      throw new Error("User not found");
    }
  };

  // Login Function (Supports Email & Username)
  const login = async (identifier, password) => {
    try {
      let email = identifier;

      if (!identifier.includes("@")) {
        email = await getEmailFromUsername(identifier); 
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Logout Function
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
