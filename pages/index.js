import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import Image from 'next/image'

const supabase = createClient("https://ukkudmxrtbwpjltpzlgj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODA4MDYwNSwiZXhwIjoxOTUzNjU2NjA1fQ.m8w2kOL2jjD4WoyZCwpy4Aper-8Gvw05Tomx2Yop7ik")
const user = supabase.auth.user();

export default function App() {
  const [session, setSession] = useState([])

  supabase.auth.onAuthStateChange((evnet, session) => {
    setSession(session)
  })

  return session ? <Chat/> : <SignIn/>;
}

function SignIn() {
  const signInWithDiscord = async () => await supabase.auth.signIn({ provider:"discord" });
  const signInWithGitHub = async () => await supabase.auth.signIn({ provider:"github" });
  const signInWithTwitch = async () => await supabase.auth.signIn({ provider:"twitch" });
  
  return (
    <div className="signin">
      <button onClick={signInWithDiscord}>Continue with Discord</button>
      <button onClick={signInWithGitHub}>Continue with GitHub</button>
      <button onClick={signInWithTwitch}>Continue with Twitch</button>
    </div>
  )
}


function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState();
  
  
  async function sendMessage(e) {
    e.preventDefault();
    
    switch (input) {
      case "":
        return;
        case "/signout":
        await supabase.auth.signOut();
        return;
      default:
        await supabase.from("messages").insert([{name: user.user_metadata.name, message: input, picture: user.user_metadata.picture}]);
        setInput("")
    }
  }
  supabase.from("messages").on("*", (res) => messages && setMessages([...messages, res.new])).subscribe();
  
  useEffect(async () => {
    const {data} = await supabase.from('messages').select();
    setMessages(data);
  }, [])

  return (
    <main className="chat">
      <ul>
        {messages && messages.map((msg) => {
          return (
            <li key={msg.created_at}>
              <img src={msg.picture} width={35} height={35}/>
              <div>
                <h1>{msg.name}</h1>
                <p>{msg.message}</p>
              </div>
            </li>
          )
        })}
      </ul>

      <form onSubmit={sendMessage}>
        <input value={input} onChange={(input) => setInput(input.target.value)} placeholder="Message" />
        <button type="submit">Send</button>
      </form>
    </main>
  )
}