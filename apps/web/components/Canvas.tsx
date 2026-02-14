"use client";
import {IconButton} from "./Icons";
import { useGame } from "../draw/newcalls";
import { Circle, Pencil, RectangleHorizontalIcon, Hand, Eraser } from "lucide-react";
type Shape = "circle" | "rect" | "pencil" | "hand" | "eraser";


let activated = "";

export function Canvas({
    roomId,
    socket

}:{
    roomId: number;
    socket: WebSocket;
}) {
    const {canvasRef, selectedTool, setSelectedTool } = useGame(roomId, socket);
    return (
        <div className="h-screen overflow-hidden bg-white" >
            <canvas ref={canvasRef}></canvas>
            <TopBar setSelectedTool={setSelectedTool} selectedTool = {selectedTool} />
        </div>
    )
}
export function TopBar({
    selectedTool,
    setSelectedTool,
}:{
    selectedTool: Shape;
    setSelectedTool: (tool: Shape) => void;
}) {
    if(selectedTool === "circle"){
        activated = "circle";
    } else if (selectedTool === "rect"){
        activated = "rect";              
    } else if (selectedTool === "hand"){
        activated = "hand";
    } else if (selectedTool === "eraser"){
        activated = "eraser";
    }
    return (
        <div className="fixed overflow-hidden top-[10px] left-[10px] bg-gray-500">
            <IconButton 
            selectedTool ={selectedTool}
            setSelectedTool = {setSelectedTool}
            icon = {<RectangleHorizontalIcon />}
            onClick ={() =>{
                setSelectedTool("rect")
            }}
            activated = {activated === "rect"}
            />

            <IconButton
            selectedTool= { selectedTool}
            setSelectedTool={selectedTool}
            icon = {<Circle/>}
            onClick={()=>{
                setSelectedTool("circle")
            }}
            activated = {activated === "circle"}   
            />

            <IconButton
            selectedTool= { selectedTool}
            setSelectedTool={selectedTool}
            icon = {<Pencil/>}
            onClick={()=>{
                setSelectedTool("pencil")
            }}
            activated = {activated === "pencil"}   
            />


            <IconButton
            selectedTool= { selectedTool}
            setSelectedTool={selectedTool}
            icon = {<Hand/>}
            onClick={()=>{
                setSelectedTool("hand")
            }}
            activated = {activated === "hand"}   
            />

            <IconButton
            selectedTool= { selectedTool}
            setSelectedTool={selectedTool}
            icon = {<Eraser/>}
            onClick={()=>{
                setSelectedTool("eraser")
            }}
            activated = {activated === "eraser"}   
            />

        </div>
    )
}