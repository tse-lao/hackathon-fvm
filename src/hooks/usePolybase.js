import { v4 as uuidv4 } from 'uuid';



export default async function createFolder(name, address, parent){
    const updatedAt = new Date().toISOString();
    const newId = uuidv4();

    const collection = await polybase.collection("Folder").create([
        newId,
        name,
        address,
        updatedAt, 
        parent
    ])
    
    console.log(collection);
    
    return true;
}