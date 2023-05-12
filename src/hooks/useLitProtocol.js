import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethers } from 'ethers';
const PUBLIC_KEY ="0x04808e24bb109fac42882de0203d77f2ad60ffdbf7ff339d77036f71b35095198aa8cb2705030b4b1a206b066cb0bebd18b45353a79f150eebd6b1e986e97f5d32"


export async function litJsSdkLoaded( ) {
    const client = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });

    await client.connect();
    window.litNodeClient = client;
  }
  
  //QmfYdvmY4cifjzis7zWq4UmhVYKJq5J3AiyEVBFRCwx1TB => validate
  //cid => accept
  //rows => accept
  //pkp singing  => valide
  
  
  export async function runLitProtocol(dataCID) {
    // you need an AuthSig to auth with the nodes
    // this will get it from metamask or any browser wallet
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    
    console.log(authSig)
    await litJsSdkLoaded();

    const litCID = "QmanxAzq5LrkJdGWR1V8SWN8kpGVJawqnV9YoyMnMg9R9w";

    //string to 8uint array 
    const array  = dataCID.split('').map((char) => char.charCodeAt(0));
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
  
  
  export async function recoverAddress(dataCID){
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