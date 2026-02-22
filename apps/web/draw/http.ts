import { api } from '../lib/api'

export async function getExistingShapes(roomId: Number) {
    try {
        const slugResponce = await api.get(
            `/roomchats/${roomId}`,
        );
        const slug = slugResponce.data.slug;

        if (!slug) {
            return [];
        }
        const res = await api.get(`/chats/${slug}`);

        const messages: { id: number, message: string }[] = res.data.messages || [];
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