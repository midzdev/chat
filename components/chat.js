import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, getAuth, signOut, signInWithPopup, onAuthStateChanged } from "firebase/auth";

export async function getServerSideProps() {
  const response = await fetch("https://g.tenor.com/v1/trending?key=X3A4GSGCN247");
  const json = await response.json();
    
  return { props: { gifs: json.results } };
}

const app = initializeApp({
  apiKey: "AIzaSyDdrKExYOF12O0g8LIg8o2BxeeORJ8NsJA",
  authDomain: "midzchat.firebaseapp.com",
  databaseURL: "https://midzchat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "midzchat",
  storageBucket: "midzchat.appspot.com",
  messagingSenderId: "121467884136",
  appId: "1:121467884136:web:5c15c77aeab247eb9f61dd",
});

const db = getFirestore(app);

export default function Chat({ gifs }) {
  const [data, setData] = useState();
  const [input, setInput] = useState("");
  const dummy = useRef();
  
  useEffect(async () => {
    const chatCollection = collection(db, "data");
    const snapshot = await getDocs(chatCollection);
    console.log(snapshot.docs);
  }, []);

  console.log(data)

  async function sendMessage(e) {
    e.preventDefault();
    if (input === "") return;
}

  function toggleMore() {
    document.getElementsByClassName("buttons")[0].classList.toggle("active");
    document.getElementsByClassName("gifsMenu")[0].classList.remove("active");
  }

  function toggleGifsMenu() {
    document.getElementsByClassName("gifsMenu")[0].classList.toggle("active");
    document.getElementsByClassName("buttons")[0].classList.remove("active");
  }

  return (
    <div className="chat">
      <Script src="https://kit.fontawesome.com/f86cbebdfa.js" crossOrigin="anonymous" />
      <ul>
        {/* {data && data.messages.map((message) => 
          <li key={message.timestamp}>
            <img src={message.profile_picture || "https://i.pinimg.com/originals/a6/f3/c5/a6f3c55ace829310723adcb7a468869b.png"} />
            {message.text.startsWith("https://media.tenor.com/images/") ? <img src={message.text} /> : <p>{message.text}</p> }
          </li>
        )} */}
        <div ref={dummy}></div>
      </ul>

      <div className="more">
        <div className="buttons">
          <button style={{ marginBottom: 8 }} onClick={toggleGifsMenu}>
            <i className="fa-solid fa-play"></i>
            GIFS
          </button>
          <button onClick={async () => await signOut(auth) && location.reload()}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            Sign Out
          </button>
        </div>
        <div className="gifsMenu">
          {/* {gifs.map((gif) => {
            return <img key={gif.id} src={gif.media[0].gif.url} />;
          })} */}
        </div>
      </div>

      <form onSubmit={sendMessage}>
        <button type="button" onClick={toggleMore}>
          <i className="fa-solid fa-ellipsis"></i>
        </button>
        <input value={input} onChange={({ target }) => setInput(target.value)} placeholder="Enter your message..." autoFocus onBlur={({ target }) => target.focus()} />
      </form>
    </div>
  );
}