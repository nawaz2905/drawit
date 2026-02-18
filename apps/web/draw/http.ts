import {api} from '../lib/api'

export async function getExistingShapes(roomId:Number){
    try{
        const slugResponce = await api.get(
            `/roomchats/${roomId}`,
        );
        const slug = slugResponce.data.slug;

        if(!slug){
            return[];
        }
        const res = await api.get(`/chats/${slug}`);

        const message: string[] = res.data.message || [];
        const shapes:any = message
           .map((str)=>{
            try{
                return JSON.parse(str);
            }catch(err){
                console.error("Failed to parse message", str, err);
                return null;
            }
           })
           .filter(Boolean);
        return shapes;   
    }catch(err){
        console.error("Error fetching shapes", err);
        return[];
    }
}