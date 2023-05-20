import { Polybase } from "@polybase/client";

import { v4 as uuidv4 } from 'uuid';

const db = new Polybase({
    defaultNamespace: "pk/0xd89cd07b2a59a0059a9001225dc6f2e27c207cc2e8df89c9f4dfcb1673f1c25b201619d55d529a0c016ea157b79abbfd26b9e57405a1de29682df4c215e32dd2/HACK",
    
  });
  

export async function createJob(name, description, jobCid, dataformat, categories, owner) {
    const updatedAt = new Date().toISOString();
    const newId = uuidv4();


    return new Promise(async (resolve, reject) => {
        try {
            const collection = await db.collection("Jobs").create([
                newId,
                name,
                description,
                jobCid, 
                dataformat, 
                categories,
                updatedAt,
                owner
            ])
            
            resolve(collection)
        } catch (error) {
            reject(error)
        }

    });

    //id, name, description, jobCid, datafromat, categories, createdAt, owner
}