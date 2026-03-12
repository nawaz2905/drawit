import { api } from '../lib/api'

export async function getExistingShapes(roomId: Number) {
    try {
        const roomResponse = await api.get(
            `/roomchats/${roomId}`,
        );
        const messages: { id: number, message: string }[] = roomResponse.data.messages || [];
        const shapes: any = messages
            .map((item) => {
                try {
                    const shape = JSON.parse(item.message);
                    return { ...shape, id: item.id };
                } catch (err) {
                    console.error("Failed to parse message", item.message, err);
                    return null;
                }
            })
            .filter(Boolean);
        return shapes;
    } catch (err) {
        console.error("Error fetching shapes", err);
        return [];
    }
}
