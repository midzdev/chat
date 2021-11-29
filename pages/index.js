import { createClient } from "@supabase/supabase-js"
import { useState, useEffect, useRef } from "react"

const supabase = createClient("https://ukkudmxrtbwpjltpzlgj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODA4MDYwNSwiZXhwIjoxOTUzNjU2NjA1fQ.m8w2kOL2jjD4WoyZCwpy4Aper-8Gvw05Tomx2Yop7ik")

export default function App() {
  const [name, setName] = useState()
  useEffect(() => setName(document.cookie.replace("name=", "")));
  return name ? <Main/> : <SignIn/>
}

function SignIn() {
  const [name, setName] = useState("");

  return (
    <form onSubmit={() => {
      if (!name) return;
      document.cookie = `name=${name}; max-age=31536000; secure;`
      }}>
      <input value={name} onChange={(name) => setName(name.target.value)} placeholder="Enter your name..."/>
    </form>
  )
}

function Main() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const dummy = useRef()

  
  async function handleSubmit(e) {
    e.preventDefault()
    
    switch (input) {
      case "":
        return;
      case "/signout":
        await supabase.auth.signOut();
        return;
      default:
        await supabase.from("messages").insert([{ name: document.cookie.replace("name=", ""), message: input }])
      }
      setInput("")
    }
    
    
    useEffect(async () => {
      const { data } = await supabase.from("messages").select()
      setMessages(data)
      dummy.current.scrollIntoView()
    }, [])

    useEffect(async () => {
      supabase.from("messages").on("*", async () => {
        const { data } = await supabase.from("messages").select()
        setMessages(data)
        dummy.current.scrollIntoView()
      }).subscribe()
    })



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

        <div ref={dummy}></div>
      </ul>

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(value) => setInput(value.target.value)} placeholder="Message"/>
      </form>
    </main>
  )
}