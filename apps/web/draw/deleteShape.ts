import axios from 'axios';

export async function handleDeletion(roomId: any, type: string, startX: number, startY: number, endX: number, endY: number) {
    try {
        const slugResponse = await axios.get(`http://localhost:3001/room/id/${roomId}`);
        const slug = slugResponse.data.slug;
        const response = await axios.post(`http://localhost:3001/deletechat/${slug}`, {
            type: type,
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY
        });
        if (response.status === 200) {
            console.log("Deletion successfull");
        } else {
            console.log("Deletion unsuccessfull")
        }
    } catch (e) {
        console.log("Error in deletion: " + e)
    }
}