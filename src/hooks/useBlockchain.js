import { DB_NFT_address } from "@/constants"
import { Alchemy, Network } from "alchemy-sdk"

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

export async function getTokenHolder(tokenId) {
    const nfts = await alchemy.nft.getOwnersForNft(DB_NFT_address, tokenId);
    return nfts
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
    for (let record of list) {
        try {
            console.log(record);
            let name = record.cid;
            if (open) {
                name = record.name;
            }
            
            console.log(name)
    
            let carRecord = carRecords.find(carRecord => carRecord.fileName == name);
        if (carRecord !== undefined) {
            record.carRecord = carRecord;
            
            if(open){
                record.carRecord.userName = "0x00";
            }
        } else {
            
            // Handle the case where no matching car record is found
            console.error(`No car record found with name: ${name}`);
            continue;
}
       
    
            let result = await uploadRecord(record);
            results.push(result);
        } catch (error) {
            console.error(`Error processing record ${record.cid}: ${error.message}`);
            results.push({message: `Error processing record ${record.cid}: ${error.message}`});
        }
    }
    return results;

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
        const cidHex = "0x" + cidHexRaw
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
