import { getLighthouse } from "@/lib/createLighthouseApi";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethers } from 'ethers';
import { toast } from "react-toastify";
import { useContract } from "./useContract";
import { createJWTToken } from "./useLighthouse";
const PUBLIC_KEY = "0x04808e24bb109fac42882de0203d77f2ad60ffdbf7ff339d77036f71b35095198aa8cb2705030b4b1a206b066cb0bebd18b45353a79f150eebd6b1e986e97f5d32"
export async function litJsSdkLoaded() {
  const client = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });

  await client.connect();
  window.litNodeClient = client;
}

//QmfYdvmY4cifjzis7zWq4UmhVYKJq5J3AiyEVBFRCwx1TB => validate
//cid => accept
//rows => accept
//pkp singing  => valide

// Use the CreateSpitter function from useContract

export async function runLitProtocol(dataCID) {
  // you need an AuthSig to auth with the nodes
  // this will get it from metamask or any browser wallet
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });

  console.log(authSig)
  await litJsSdkLoaded();

  const litCID = "QmanxAzq5LrkJdGWR1V8SWN8kpGVJawqnV9YoyMnMg9R9w";

  //string to 8uint array 
  const array = dataCID.split('').map((char) => char.charCodeAt(0));
  const encoder = new ethers.utils.AbiCoder();


  const signingMessage = encoder.encode(["string"], [dataCID])

  //turn back 
  console.log(array);
  const string = String.fromCharCode(...array);

  console.log(string == dataCID);

  console.log("string", string);
  const results = await litNodeClient.executeJs({
    ipfsId: litCID,
    authSig,
    jsParams: {
      cid: dataCID,
      publicKey: PUBLIC_KEY,
      sigName: "sig1",
      toSign: array,
    },
  });
  console.log("results", results);
  const { signatures, response } = results;
  console.log("response", response);
  console.log(signatures);


  return signatures

}


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
  const url = "http://localhost:4000"

  const pUrl = "https://apollo-server-gateway.herokuapp.com/"

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
  const getToken = await createJWTToken();
  const apiKey = await getLighthouse(creator);

  const url = "http://localhost:4000"

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

export async function mintNFTDB (tokenID, txHash,  creator, mintPrice) {
  //const mergedCID = await retrieveMergeCID(tokenID, creator);
  const {createDB_NFT} = useContract();
  const mergedCID = "QmYnnwvyU6GhbPdHfzTBmrQdDTnYzBiNgSAykC9qnuhK1v";
  if(mergedCID == null) {
    toast.error("Error 2: no merged..")
    return null;
  }
  //
  

  
  const txContract = "0x94ac8ca31d45204323b3e1ea62d588088daabd88"
  getSignature();
  
  
  const toSign = tokenID.concat("", mergedCID).concat("", mintPrice).concat("", txContract);

  const sign = await getSignature(toSign);
  
  

  const result = await createDB_NFT(tokenID, mergedCID, mintPrice, hardCodedAddress, sign.r, sign.s, sign.v, txContract, creator)
  console.log(result);
  //sign the input TODO: needs to be implemented in the backend for 
  // tokenid, dbCID, mintPrice, address
  
  return true;
  
}

export async function getSignature(message){
  
  const url = "http://localhost:4000"
  
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