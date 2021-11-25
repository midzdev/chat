import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
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

  useEffect(() => {
    onSnapshot(collection(db, "messages"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setData(data);
    });
  }, []);

  async function sendMessage(e) {
    e.preventDefault();

    await addDoc(collection(db, "messages"), {
      name: auth.currentUser.displayName,
      message: message,
    });
  }

  return (
    <>
      <main>
        {data.map((msg) => {
          return (
            <div id="message" key={msg.id}>
              <h1>{msg.name}</h1>
              <p>{msg.message}</p>
            </div>
          );
        })}
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(msg) => setMessage(msg.target.value)}
        ></input>
        <button type="submit">Send</button>
      </form>
    </>
  );
}

function LogIn() {
  return (
    <>
      <button
        onClick={() =>
          signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
          })
        }
      >
        eeeeeeeee
      </button>{" "}
    </>
  );
}

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  return user ? <Chat /> : <LogIn />;
}
