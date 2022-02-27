import { useState, useEffect, useRef } from "react";
import { GoogleAuthProvider, getAuth, signOut, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

import Chat from "../components/chat"
import LogIn from "../components/login"

export default function App() {
  const [authState, setAuthState] = useState()

  onAuthStateChanged(auth, (user) => {
    setAuthState(user)
  })

  return auth.currentUser || authState ? <Chat /> : <LogIn />;
}
