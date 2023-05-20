import { Alchemy, Network } from "alchemy-sdk"

import { DB_NFT_address } from "@/constants"

const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network: Network.MATIC_MUMBAI
}

const alchemy = new Alchemy(config)

export async function getNfts(address) {
    const nfts = await alchemy.nft.getNftsForOwner(address, {
        contractAddresses: [DB_NFT_address]
    })
    let nftsData = []
    for (const nft of nfts.ownedNfts) {
        // @ts-ignore

        nftsData.push(nft)
    }
    return nftsData
}

// Decrypt file nodejs
import { Polybase } from '@polybase/client'
import { ethPersonalSign } from "@polybase/eth"
import CID from 'cids'
import { ethers } from 'ethers'
import { v4 as uuidv4 } from "uuid"
import { getUploads } from "./useLighthouse"

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
async function signInPolybase() {
    const db = new Polybase({
        defaultNamespace:"pk/0xd89cd07b2a59a0059a9001225dc6f2e27c207cc2e8df89c9f4dfcb1673f1c25b201619d55d529a0c016ea157b79abbfd26b9e57405a1de29682df4c215e32dd2/HACK",
    });

    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATEKEY, provider);

    // console.log("PRIVATE_KEY", wallet.privateKey);

    // If you want to edit the contract code in the future,
    // you must sign the request when calling applySchema for the first time
    db.signer((data) => {
        return {
            h: "eth-personal-sign",
            sig: ethPersonalSign(wallet.privateKey, data),
        };
    });
    // console.log(db);
    return db;
}
export default async function MatchRecord(list, accessToken, open) {


    let carRecords = [];

    try {

        //loop over all of it 

        let page = 1
        while(page < 4){
            const result = await getUploads(accessToken, page)
            if(result.length == 0){
                break;
            }
            carRecords = [...carRecords, ...result]
            page++
        }

    } catch (error) {
        console.log(error)
        return  { message: 'Error collection car Files.' };
    }
    
    console.log(carRecords)
    let results = [];
    try {
        

        for (let record of list) {
            console.log(record)
            //find the name of each car Record to add the deatails of the car record. 
            let name = record.cid
            if(open){
                 name = record.name
            }
           
            let carRecord = carRecords.find(carRecord => carRecord.fileName == name);
            record.carRecord = carRecord;


            let result = await uploadRecord(record);
            results.push(result);
        }

        return  { message: 'Upload Successful', data: results };
    } catch (error) {
        console.error(error);
        return  { message: 'Internal Server Error' };
    }

}
async function uploadRecord(record) {
    // logic to upload record to database
    // this is just an example, replace with your own logic

    return new Promise(async (resolve, reject) => {
        const db = await signInPolybase();

        const newId = uuidv4();
        const addedAt = new Date().toISOString();
        console.log(record.carRecord)
        const cidHexRaw = new CID(record.carRecord.pieceCid).toString('base16').substring(1)
        const cidHex = "0x00" + cidHexRaw
        console.log(cidHex)
        
        
        if(!record.carRecord && !record.carRecord.userName && !record.carRecord.id && !record.carRecord.pieceCid && !record.carRecord.payloadCid){
            reject("Invalid Car Record")
        }
        
        if(record.name == null && record.cid == null && record.metadata == null && record.type == null){
            reject("Invalid Record")
        }

        try {
            // constructor(id: string,name:string,  cid: string, metadata:string, categories: string[], type: string,  addedAt: string, owner: string, carId: string, carPieceCid: string, carPayload: string, cidHex: string){
            const result = await db.collection("File").create([
                newId,
                record.name,
                record.cid,
                record.metadata,
                ["no_category"],
                record.type,
                addedAt,
                record.carRecord.userName,
                record.carRecord.id,
                record.carRecord.pieceCid,
                record.carRecord.payloadCid,
                record.carRecord.pieceSize, 
                record.carRecord.carSize,
                record.carRecord.fileSize,
                cidHex
            ])

            resolve(result);
        } catch (error) {
            reject(error)
        }
    });
}
