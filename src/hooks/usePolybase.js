import { Polybase } from "@polybase/client";

import { ethPersonalSign } from '@polybase/eth';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';

async function signInPolybase() {
    const db = new Polybase({
        defaultNamespace:"pk/0xd89cd07b2a59a0059a9001225dc6f2e27c207cc2e8df89c9f4dfcb1673f1c25b201619d55d529a0c016ea157b79abbfd26b9e57405a1de29682df4c215e32dd2/HACK",
    });
    
    const privateKey = process.env.NEXT_PUBLIC_PRIVATEKEY;
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(wallet);
    db.signer((data) => {
        return {
            h: "eth-personal-sign",
            sig: ethPersonalSign(wallet.privateKey, data),
        };
    });
    console.log(db);
    return db;
}



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
            console.log(error)
            reject(error)
        }

    });

    //id, name, description, jobCid, datafromat, categories, createdAt, owner
}

export async function submitProposal(bountyID, name, description, proposalCID, startCommand, endCommand, numOfInputs, owner) {
    const updatedAt = new Date().toISOString();
    const newId = uuidv4();
    console.log(newId);
    const db = await signInPolybase().catch((err) => {
        console.log(err);
    });

    console.log(db);


    return new Promise(async (resolve, reject) => {

        try {
            const collection = await db.collection("BountyProposal").create([
                newId,
                bountyID,
                name,
                description,
                proposalCID,
                startCommand,
                endCommand,
                numOfInputs,
                owner
            ])

            resolve(collection)
        } catch (error) {
            console.log(error);
            reject(error)
        }

    });

    //id:string, bountyID:string, proposalCID: string, name: string, instructions: string, startCommand:string, endCommand:string, numOfInputs:number, creator:string

}