import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";

export async function signAuthMessage  (
    
){
  
  
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
    const signedMessage = await signer.signMessage(messageRequested);
    
    return({
      signedMessage: signedMessage,
      publicKey: address
    });
  }

export default async function getApiKey (address){

  

    const signedMessage = await signAuthMessage(address)

    const response = await lighthouse.getApiKey(address, signedMessage)
    localStorage.setItem("lighthouse", response.data.apiKey)

    return response.data.apiKey;
    /* { data: { apiKey: '7d8f3d18.eda91521aa294773a8201d2a7d241a2c' } } */
}
  
export async function getLighthouse(address) {
    let api = await localStorage.getItem("lighthouse")
    console.log(api);
    
    if(!api){
        api =  await getApiKey(address)
    }
    return api;
}

export async function uploadMetaData(string) {
    const api = await getLighthouse();
    const response = await lighthouse.uploadText(string, api);
    console.log(response)
    return response;
}