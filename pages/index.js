import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const app = initializeApp({
  apiKey: "AIzaSyCOc_h3YcJE7EC2xGIB0WQKmKc7FyjaHEc",
  authDomain: "techquid-web.firebaseapp.com",
  projectId: "techquid-web",
  storageBucket: "techquid-web.appspot.com",
  messagingSenderId: "596423863198",
  appId: "1:596423863198:web:be36a8ca54b0145db3448f",
});

const auth = getAuth();
const db = getFirestore();

function Chat() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(async () => {
    await onSnapshot(
      query(collection(db, "Chat"), orderBy("createdAt")),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setData(data);
      }
    );
  }, []);

  async function sendMessage(e) {
    e.preventDefault();

    if (message == "") return;

    await addDoc(collection(db, "Chat"), {
      name: auth.currentUser.displayName,
      message: message,
      createdAt: serverTimestamp(),
    });

    setMessage("");
  }

  return (
    <main className="Chat">
      <ul>
        {data.map((msg) => {
          return (
            <li id="message" key={msg.id}>
              <h1>{msg.name}</h1>
              <p>{msg.message}</p>
            </li>
          );
        })}
      </ul>

      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(msg) => setMessage(msg.target.value)}
          placeholder="Message"
        ></input>
        <button type="submit">Send</button>
      </form>
    </main>
  );
}

function LogIn() {
  return (
    <main className="login">
      <button
        id="continue-with-google"
        onClick={() =>
          signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
          })
        }
      >
        Continue with Google
      </button>
    </main>
  );
}

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  return user ? <Chat /> : <LogIn />;
}
