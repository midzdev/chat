import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, useRef } from "react";

const supabase = createClient("https://ukkudmxrtbwpjltpzlgj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODA4MDYwNSwiZXhwIjoxOTUzNjU2NjA1fQ.m8w2kOL2jjD4WoyZCwpy4Aper-8Gvw05Tomx2Yop7ik");
const user = supabase.auth.user();

supabase.auth.onAuthStateChange(() => user ? null : location.reload())

export default function App() {

  return user ? <Chat /> : <LogIn /> 
}

function LogIn() {
  return (
    <main>
      <a onClick={async() => await supabase.auth.signIn({ provider: "github" })}>Continue with GitHub</a>
      <a onClick={async() => await supabase.auth.signIn({ provider: "twitter" })}>Continue with Twitter</a>
    </main>
  )
}

function Chat() {
  const [messages, setMessages] = useState();
  const [input, setInput] = useState("");
  const dummy = useRef();

  useEffect(async() => {
    const { data } = await supabase.from("messages").select()
    setMessages(data)
    dummy.current.scrollIntoView()
  }, []);
  
  useEffect(async() => {
    supabase.from("messages").on("*", async () => {
      const { data } = await supabase.from("messages").select();
      setMessages(data);dummy.current.scrollIntoView();
    }).subscribe();
  });

  async function sendMessage(e) {
    e.preventDefault();

    switch (input.toLowerCase()) {
      case "": return;
      case "/signout":
        await supabase.auth.signOut();
        location.reload();
        break;
      default:
        await supabase.from("messages").insert([{ profile_picture: user.user_metadata.avatar_url, text: input}])
        setInput("");
    }
  }
  
  return (
    <div className="chat">
      <ul>
        {messages && messages.map((message) => (
          <li key={message.created_at}>
            <img src={message.profile_picture} />
            <p>{message.text}</p>
          </li>
        ))} <div ref={dummy}></div>
      </ul>

      <form onSubmit={sendMessage}>
        <input value={input} onChange={({target}) => setInput(target.value)} placeholder="Enter your message..." autoFocus onBlur={({ target }) => target.focus()}/>
      </form>
    </div>
  );
}
