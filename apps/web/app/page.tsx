"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Home(){
  const [roomId, setRoomId] = useState("");
  const router = useRouter()

  return (
    <div >
      <input value={roomId} onChange={(e)=>{setRoomId(e.target.value)}} type="text" placeholder="Room Id" ></input>
      <button onClick={() => {
        router.push(`room/${roomId}`)
      }} >Join the Room</button>
    </div>
  )
}