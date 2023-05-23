import { getLighthouse } from "@/lib/createLighthouseApi";
import { ethers } from 'ethers';
import { toast } from "react-toastify";
import { readJWT } from "./useLighthouse";
const PUBLIC_KEY = "0x04808e24bb109fac42882de0203d77f2ad60ffdbf7ff339d77036f71b35095198aa8cb2705030b4b1a206b066cb0bebd18b45353a79f150eebd6b1e986e97f5d32"

export async function recoverAddress(dataCID) {
  const str = dataCID;

  const encoder = new ethers.utils.AbiCoder();


  const signingMessage = encoder.encode(["string"], [str])
  const verMessage = ethers.utils.keccak256(signingMessage)
  // console.log(verMessage)
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const signature = await signer.signMessage(str);

  //(bytes);
  //ethers.utils.recoverAddress(signed, signature);
  console.log(signature)
  const sig = ethers.utils.splitSignature(signature);
  console.log('r:', sig.r);
  console.log('s:', sig.s);
  console.log('v:', sig.v);
}

export async function validateInput(tokenID, cid, rows) {


  const url = "https://apollo-server-gateway.herokuapp.com/"

  const query = `
    query VerifyCID($tokenId: String!, $cid: String!, $rows: Int!) {
      verifyCID(tokenID: $tokenId, cid: $cid, rows: $rows) {
        r
        v
        s
      }
    }`

  console.log(tokenID.toString(), cid, rows)
  try {
    const fetchCID = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "query": query,
        "variables": {
          "tokenId": tokenID,
          "cid": cid,
          "rows": rows
        }
      }
      )
    })

    const result = await fetchCID.json();
    console.log(result);
    return result.data.verifyCID;


  } catch (e) {
    console.log(e)
    toast.error("Error 2: " + e)
  }
}

export async function retrieveMergeCID(tokenID, creator) {
  const getToken = await readJWT(creator);
  const apiKey = await getLighthouse(creator);

  const url = "https://apollo-server-gateway.herokuapp.com/";

  const query = `
    query Query($tokenId: String, $jwtToken: String, $creator: String, $apiKey: String) {
      combineCIDForDB(tokenId: $tokenId, jwtToken: $jwtToken, creator: $creator, apiKey: $apiKey)
    }
    `
    
    
  try {
    const fetchCID = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "query": query,
        "variables": {
          "tokenId": tokenID,
          "jwtToken": getToken,
          "creator": creator,
          "apiKey": apiKey,
        }
      })
    })
    
    const result = await fetchCID.json();
    console.log(result)
    console.log(result.data.combineCIDForDB);
  
    //get all the creators and add them with a percentage back. 
    
    //

    return result.data.combineCIDForDB;
  } catch (e) {
    console.log(e)
    toast.error("Error 2: " + e)
    
    return null;
  }

}


export async function getSignature(message){
  
  const url = "https://apollo-server-gateway.herokuapp.com/"
  
  const query = `
  query SignMessage($message: String) {
    signMessage(message: $message) {
      r
      s
      v
    }
  }
    `
    
    try {
      const getSignature = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "query": query,
          "variables": {
            "message": message,
          }
        })  
      })
        
      const result = await getSignature.json();
      console.log(result.data.signMessage);
      return result.data.signMessage;
    } catch (e) {
      console.log(e)
      toast.error("Error 2: " + e)
        
      return null;
    }

}
