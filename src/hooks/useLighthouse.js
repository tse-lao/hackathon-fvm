import { DB_NFT_address } from '@/constants/contractAddress';
import { getJWT } from '@lighthouse-web3/kavach';
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';

export async function signAuthMessage  (){
  
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


  export async function shareFile(cid, creator){

    // Then get auth message and sign
    // Note: the owner of the file should sign the message.
    const {publicKey, signedMessage} = await signAuthMessage();
    
    const publicVerifier = "0xf129b0D559CFFc195a3C225cdBaDB44c26660B60"
  
    const publicKeyUserB = [creator, publicVerifier];
    
    const res = await lighthouse.shareFile(
      publicKey,
      publicKeyUserB,
      cid,
      signedMessage
    );
  
    console.log(res)
    
    return res;
    /*
      data: {
        cid: "QmTTa7rm2nMjz6wCj9pvRsadrCKyDXm5Vmd2YyBubCvGPi",
        shareTo: ["0x201Bcc3217E5AA8e803B41d1F5B6695fFEbD5CeD"],
        status: "Success"
      }
    */
    /*Visit: 
        https://files.lighthouse.storage/viewFile/<cid>  
      To view encrypted file
    */
  }
  
export async function grantSmartAccess(cid, tokenID, minRows) {

    const conditions = [
      {
        id: 1,
        chain: "Mumbai",
        method: "hasAccess",
        standardContractType: "Custom",
        contractAddress: DB_NFT_address,
        returnValueTest: {
          comparator: "==",
          value: "true",
        }, 
        parameters: [`${tokenID}`, ":userAddress"]

      }
    
    ]

    const aggregator = "([1])";
    
    const {signedMessage, publicKey} = await signAuthMessage()
    const response = await lighthouse.applyAccessCondition(
        publicKey,
        cid, 
        signedMessage,
        conditions, 
        aggregator 
    )
    
    
    return response;
}

export async function createJWTToken(){
  const {signedMessage, publicKey} = await signAuthMessage();
  const response = await getJWT(publicKey, signedMessage);
  
  return response.JWT;
}