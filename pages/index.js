import Head from "next/head";
import { initializeApp } from "firebase/app";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

initializeApp({
  apiKey: "AIzaSyCOc_h3YcJE7EC2xGIB0WQKmKc7FyjaHEc",
  authDomain: "techquid-web.firebaseapp.com",
  projectId: "techquid-web",
  storageBucket: "techquid-web.appspot.com",
  messagingSenderId: "596423863198",
  appId: "1:596423863198:web:be36a8ca54b0145db3448f",
});

const db = getFirestore();

function Chat() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  const dummy = useRef();
  
  useEffect(() => onSnapshot(query(collection(db, "Chat"), orderBy("createdAt")), (snapshot) => setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))), []);

  async function send(e) {
    e.preventDefault();

    if (message === "") { return }
    else if (message === "/signout") { signOut(getAuth()) } 
    else {
      await addDoc(collection(db, "Chat"), { name: getAuth().currentUser.providerData[0].displayName, message: message, createdAt: serverTimestamp() });
      setMessage("");
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <main className="chat">
      <Head>
        <title>Chat</title>
      </Head>

      <ul>
        {data.map((info) => {
          return (
            <li key={info.id}>
              <h1>{info.name}</h1>
              <p>{info.message}</p>
            </li>
          );
        })}
        <div ref={dummy}></div>
      </ul>

      <form onSubmit={send}>
        <input value={message} onChange={(value) => setMessage(value.target.value)} placeholder="Message"></input>
        <button type="submit">Send</button>
      </form>
    </main>
  );
}

function LogIn() {
  return (
    <main className="login">
      <Head>
        <title>Log In</title>
      </Head>
      <button id="continue-with-google" onClick={() => signInWithPopup(getAuth(), new GoogleAuthProvider())}>
        Continue with Google
      </button>
    </main>
  );
}

export default function App() {
  const [user, loading, error] = useAuthState(getAuth());
  return user ? <Chat /> : <LogIn />;
}
