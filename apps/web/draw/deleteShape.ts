
import {api} from '../lib/api'

export async function handleDeletion(roomId: any, type: string, startX: number, startY: number, endX: number, endY: number) {
    try {
        const slugResponse = await api.get(`/room/id/${roomId}`);
        const slug = slugResponse.data.slug;
        const response = await api.post(`/deletechat/${slug}`, {
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