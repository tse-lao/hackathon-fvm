import { readTextAsJson } from "@/lib/dataHelper"
import { Blob, NFTStorage } from "nft.storage"
const endpoint = "https://api.nft.storage"
const token = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY 

const storage = new NFTStorage({ endpoint, token })

const useNftStorage = () => {


    const uploadMetadata = async (file) => {
        const blob = new Blob([file], { type: "application/json" })
        return await storage.storeBlob(blob)
    }

    return { uploadMetadata }
}

export async function readFromCID(cid){
    const endpoint = `https://nftstorage.link/ipfs/${cid}`
    const token = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY 
    
    let blob = await fetch(endpoint).then(r => r.blob());

    return new Promise((resolve, reject) => {
        readTextAsJson(blob, (error, jsonData) => {
            if (error) {
                resolve(null)
            } else {
                resolve(jsonData)
            }
        });
    })
  ;
    
}

export async function blobFromCID(cid){
    const endpoint = `https://nftstorage.link/ipfs/${cid}`

    let blob = await fetch(endpoint).then(r => r.blob());
    
    
    
    return new Promise((resolve, reject) => {
        readTextAsJson(blob, (error, jsonData) => {
            if (error) {
                resolve(null)
            } else {
                resolve(jsonData)
            }
        });
    })
  ;
    
}

export async function readEncryptFile(cid){
    const endpoint = `https://gateway.lighthouse.storage/ipfs/${cid}`
   
    
    let blob = await fetch(endpoint).then(r => r.blob());
    
    //now we want the car file from this 
    const { car } = await NFTStorage.encodeBlob(blob)

    const newCid = await storage.storeCar(car)
    
    const info = await storage.status(newCid)
    console.log(info)
    
    console.log(newCid);
    console.log(car);
    
    
    /* return new Promise((resolve, reject) => {
        readTextAsJson(blob, (error, jsonData) => {
            if (error) {
                console.error(error);
                resolve(null)
            } else {
                console.log(jsonData);
                resolve(jsonData)
            }
        });
    }) */
  
    
}

export default useNftStorage