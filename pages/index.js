import { createClient } from "@supabase/supabase-js"
import { useState, useEffect, useRef } from "react"

const supabase = createClient("https://ukkudmxrtbwpjltpzlgj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODA4MDYwNSwiZXhwIjoxOTUzNjU2NjA1fQ.m8w2kOL2jjD4WoyZCwpy4Aper-8Gvw05Tomx2Yop7ik")

export default function App() {
  const [name, setName] = useState()

  useEffect(() => {
    setName(document.cookie.replace("name=", ""))
  })
  
  return name ? <Main/> : <SignIn/>
}

function SignIn() {
  const [name, setName] = useState("");

  return (
    <form onSubmit={() => document.cookie = "name=" + name}>
      <input value={name} onChange={(name) => setName(name.target.value)} placeholder="Enter your name..."/>
    </form>
  )
}

function Main() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  useEffect(async () => {
    const { data } = await supabase.from("messages").select()
    setMessages(data)

    const messagesListener = supabase.from("messages").on("*", () => console.log(data)).subscribe()
    messagesListener.unsubscribe()
  })

  async function handleSend(e) {
    e.preventDefault()

    switch (input) {
      case "":
        return;
      case "/signout":
        await supabase.auth.signOut();
        return;
      default:
        await supabase.from("messages").insert([{ name: document.cookie.replace("name=", ""), message: input }])
        setInput("")
    }
  }

  return (
    <main className="chat">
      <ul>
        {messages && messages.map((msg) => {
          return (
            <li key={msg.created_at}>
              <h1>{msg.name}</h1>
              <p>{msg.message}</p>
            </li>
          )
        })}
      </ul>

      <form onSubmit={handleSend}>
        <input value={input} onChange={(value) => setInput(value.target.value)} placeholder="Message"/>
      </form>
    </main>
  )
}