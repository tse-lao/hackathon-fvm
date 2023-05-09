import * as LitJsSdk from "@lit-protocol/lit-node-client";

const PUBLIC_KEY ="0x04808e24bb109fac42882de0203d77f2ad60ffdbf7ff339d77036f71b35095198aa8cb2705030b4b1a206b066cb0bebd18b45353a79f150eebd6b1e986e97f5d32"

export default function SignMetadata() {

      
    
      async function litJsSdkLoaded() {
        const client = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });

        await client.connect();
        window.litNodeClient = client;
      }
      
      //QmfYdvmY4cifjzis7zWq4UmhVYKJq5J3AiyEVBFRCwx1TB => validate
      //cid => accept
      //rows => accept
      //pkp singing  => valide
      
      
      const runLitCode = async () => {
        // you need an AuthSig to auth with the nodes
        // this will get it from metamask or any browser wallet
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
        
        await litJsSdkLoaded();

        const litActionCode = `
          const go = async () => {
            // test an access control condition

            // only sign if the access condition is true
            
            if (cid != "QmdwVoFEcTSZY9W3h91ExJAZmnzmjBaTETv9fHSRixXRom"){
              return;
            }
            
            https://hackathon.fvm.com/checkMeta/${cid}
            cid => checkMeta => true/false
                        
            // turn CID => into JSON
            // JSON => function
            // function => METADATA CID
            
            
            
            
            

            // this is the string "Hello World" for testing
            const toSign = cid;
            // this requests a signature share from the Lit Node
            // the signature share will be automatically returned in the HTTP response from the node
            const sigShare = await LitActions.signEcdsa({ toSign, publicKey: publicKey, sigName: "sig1" });
          };



          go();
          `;
        
        const PERS = "sdfsdf"
        const CID = "QmdwVoFEcTSZY9W3h91ExJAZmnzmjBaTETv9fHSRixXRom";
        console.log(CID);

        const results = await litNodeClient.executeJs({
          code: litActionCode,
          authSig,
          jsParams: {
            cid: PERS, 
            publicKey: PUBLIC_KEY,
          },
        });
        console.log("results", results);
        const { signatures, response } = results;
        console.log("response", response);
        console.log(signatures);
      /*   const sig = signatures.sig1;
        const { dataSigned } = sig;
        const encodedSig = joinSignature({
          r: "0x" + sig.r,
          s: "0x" + sig.s,
          v: sig.recid,
        });
        
        console.log("ENCODED SIG")
        console.log(encodedSig)
      
        const { txParams } = response;
      
        console.log("encodedSig", encodedSig);
        console.log("sig length in bytes: ", encodedSig.substring(2).length / 2);
        console.log("dataSigned", dataSigned);
        const splitSig = splitSignature(encodedSig);
        console.log("splitSig", splitSig);
      
        const recoveredPubkey = recoverPublicKey(dataSigned, encodedSig);
        console.log("uncompressed recoveredPubkey", recoveredPubkey);
        const compressedRecoveredPubkey = computePublicKey(recoveredPubkey, true);
        console.log("compressed recoveredPubkey", compressedRecoveredPubkey);
        const recoveredAddress = recoverAddress(dataSigned, encodedSig);
        console.log("recoveredAddress", recoveredAddress);
      
        const txn = serialize(txParams, encodedSig);
      
        console.log("txn", txn);
      
        // broadcast txn
        const provider = new ethers.providers.JsonRpcProvider(
          // process.env.LIT_MUMBAI_RPC_URL
          "https://rpc.ankr.com/polygon_mumbai"
        );
        const result = await provider.sendTransaction(txn);
        console.log("broadcast txn result:", JSON.stringify(result, null, 4));  */
        
      }
      
      
      
      
      
  return (
    <div>
    
        <h1>Run lit actions</h1>
        
        <div className="flex">
            
                <button  onClick={e => {runLitCode()}}
                className="btn btn-primary bg-cf-500 p-5 m-5"

                >Run Signatures</button>
                    
        </div>
    </div>
    
    
  )
}
