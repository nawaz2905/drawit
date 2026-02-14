"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter()

  return (
    <div className="flex justify-center items-center h-screen w-screen"
    >
      <input className="p-10" value={roomId} onChange={(e) => { setRoomId(e.target.value) }} type="text" placeholder="Room Id" ></input>
      <button className="p-10" onClick={() => {
        router.push(`room/${roomId}`)
      }} >Join the Room</button>
    </div>
  )
}