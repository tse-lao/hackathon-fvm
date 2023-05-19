// Decrypt file nodejs
import { Polybase } from '@polybase/client';
import { ethPersonalSign } from "@polybase/eth";
import CID from 'cids';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from "uuid";

import { getUploads } from "@/hooks/useLighthouse";
async function signInPolybase() {
    const db = new Polybase({
        defaultNamespace: process.env.POLYBASE,
    });

    const wallet = new ethers.Wallet(process.env.PRIVATEKEY);

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



export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Assuming we have a function uploadRecord to upload a record to a database
    const { list, accessToken } = req.body;


    if (!list || !Array.isArray(list)) {
        return res.status(400).json({ message: 'No records provided' });
    }

    let carRecords = null;

    try {
        const result = await getUploads(accessToken);
        carRecords = result;
    } catch (error) {
        return res.status(500).json({ message: 'Error collection car Files.' });
    }

    try {
        let results = [];

        for (let record of list) {
            //find the name of each car Record to add the deatails of the car record. 
            let name = record.cid;
            let carRecord = carRecords.find(carRecord => carRecord.fileName == name);
            record.carRecord = carRecord;


            let result = await uploadRecord(record);
            results.push(result);
        }

        return res.status(200).json({ message: 'Upload Successful', data: results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function uploadRecord(record) {
    // logic to upload record to database
    // this is just an example, replace with your own logic

    return new Promise(async (resolve, reject) => {
        const db = await signInPolybase();

        const newId = uuidv4();
        const addedAt = new Date().toISOString();

        const cidHexRaw = new CID(record.carRecord.pieceCid).toString('base16').substring(1)
        const cidHex = "0x00" + cidHexRaw

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
                cidHex
            ])

            resolve(result);
        } catch (error) {
            reject(error)
        }
    });
}
