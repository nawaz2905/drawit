import { RoomCanvas } from "../../../components/RoomCanvas";

export default async function CanvasPage({
    params,
}:any ){
    const roomId= (await params).roomId;

    return <RoomCanvas roomId={roomId} ></RoomCanvas>
}