import Head from "next/head";
import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

initializeApp({
  apiKey: "AIzaSyCOc_h3YcJE7EC2xGIB0WQKmKc7FyjaHEc",
  authDomain: "techquid-web.firebaseapp.com",
  projectId: "techquid-web",
  storageBucket: "techquid-web.appspot.com",
  messagingSenderId: "596423863198",
  appId: "1:596423863198:web:be36a8ca54b0145db3448f"
});

const db = getFirestore();

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
  useEffect(() => onSnapshot(query(collection(db, "Chat"), orderBy("createdAt")), (data) => setMessages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))), []);

  async function send(e) {
    e.preventDefault();

    switch (input) {
      case "/signout":
        signOut(getAuth());
        break;
      case "":
        return;
      default:
        await addDoc(collection(db, "Chat"), { name: getAuth().currentUser.providerData[0].displayName, message: input, createdAt: serverTimestamp() });
        setInput("");
    }
  }

  return (
    <div className="chat">
      <ul>
        {messages.map((info) => {
          return (
            <li key={info.id}>
              <h1>{info.name}</h1>
              <p>{info.message}</p>
            </li>
          );
        })}
      </ul>

      <form onSubmit={send}>
        <input value={input} onChange={(input) => setInput(input.target.value)} placeholder="Message"></input>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function LogIn() {
  return (
    <div className="login">
      <button id="continue-with-google" onClick={() => signInWithPopup(getAuth(), new GoogleAuthProvider())}>
        Continue with Google
      </button>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState([]);
  onAuthStateChanged(getAuth(), (user) => user ? setUser(user) : setUser(null))
  return (
    <>
      <Head>
        <title>TQ Chat</title>
      </Head>
      {user ? <Chat /> : <LogIn />}
    </>
  ) 
}
