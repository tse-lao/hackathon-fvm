import MatchRecord from "@/hooks/useBlockchain";
import { uploadCarFile } from "@/hooks/useLighthouse";
import lighthouse from "@lighthouse-web3/sdk";
import { getMetadataFromFile } from "./dataHelper";

export const uploadAndSetFile = async (file, apiKey, progressCallback) => {
    console.log(file.target.files[0])
    try {
        let output;

            output = await lighthouse.upload(file, apiKey, progressCallback);
            const cid = output.data.Hash;
            let metadata = "no_metadata";
            
        if (file.target.files[0].type === "application/json") {
                metadata = await getMetadataFromFile(file.target);
        }
        console.log(metadata, output)
        return {
            name: file.target.files[0].name,
            type: file.target.files[0].type,
            size: file.target.files[0].size,
            cid: cid,
            metadata: metadata
        };
    } catch (error) {
        console.error('Error uploading and setting file:', error);
        throw new Error('Failed to upload file. Please try again.');
    }
};

export const uploadFileWithProgress = async (file, progressCallback, accessToken) => {
    try {
        const result = await uploadCarFile([file], progressCallback, accessToken);
        if (result === null) {
            throw new Error("Error uploading file");
        }
        return result;
    } catch (error) {
        console.error('Error uploading file with progress:', error);
        throw new Error('Failed to upload file. Please try again.');
    }
};

export const matchAndSetCarFile = async (dummyFile, accessToken, setLoadingFile, setFile, setCarError) => {
    try {
        const result = await MatchRecord([dummyFile], accessToken, true);
        if(result == []){
            throw new Error("Error matching car file");
        }
        console.log(result);
        
        setFile({ ...dummyFile});
    } catch (error) {
        console.error('Error matching and setting car file:', error);
        setCarError(true);
        setLoadingFile(false);
        throw new Error('Failed to match car file. Please try again.');
    }
};

