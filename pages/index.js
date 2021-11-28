import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient("https://ukkudmxrtbwpjltpzlgj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODA4MDYwNSwiZXhwIjoxOTUzNjU2NjA1fQ.m8w2kOL2jjD4WoyZCwpy4Aper-8Gvw05Tomx2Yop7ik")
const user = supabase.auth.user()

export default function App() {
  return user ? <Chat/> : <SignIn/>
}

function SignIn() {
  const signInWithDiscord = async () => await supabase.auth.signIn({provider:"discord"})
  const signInWithGitHub = async () => await supabase.auth.signIn({provider:"github"})

  supabase.from("messages").on("*", data => console.log(data)).subscribe()

  return (
    <div className="signin">
      <button onClick={signInWithDiscord}>Continue with Discord</button>
      <button onClick={signInWithGitHub}>Continue with GitHub</button>
    </div>
  )
}


function Chat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState()
  
  async function sendMessage() {
    await supabase.from("messages").insert([{name: user.user_metadata.name, message: input}])
  }

  useEffect(async () => {
    const {data, error} = await supabase.from('messages').select()
    setMessages(data)
  }, [])
  
  return (
    <div className="chat">
      <ul>
        {messages.map((msg) => {
          return (
            <li key={msg.created_at}>
              <h1>{msg.name}</h1>
              <p>{msg.message}</p>
            </li>
          )
        })}
      </ul>

      <form>
        <input value={input} onChange={(input) => setInput(input.target.value)}/>
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  )
}