
import {api} from '../lib/api'

export async function handleDeletion(
    roomId: number,
    shapeId: number,
    type: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number
) {
    try {
        const response = await api.post(`/deleteshape/${roomId}`, {
            id: shapeId,
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
