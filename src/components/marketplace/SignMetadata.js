import * as LitJsSdk from "@lit-protocol/lit-node-client";

const PUBLIC_KEY ="0x04808e24bb109fac42882de0203d77f2ad60ffdbf7ff339d77036f71b35095198aa8cb2705030b4b1a206b066cb0bebd18b45353a79f150eebd6b1e986e97f5d32"

export default function SignMetadata() {

  const dataCID = "QmX6iWJ52kKzzkzMgvriwJb5KV1PtpuQ4CQpjM8DE66pGM";
  const litCID = "QmanxAzq5LrkJdGWR1V8SWN8kpGVJawqnV9YoyMnMg9R9w";
  const metaCID = "bafkreigpliv6qwuawfwkea45t4rj2fzc6whbapp3awxssjmf3puqd7huve";
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


        //string to 8uint array 
        const array  = dataCID.split('').map((char) => char.charCodeAt(0));
        
        //turn back 
        const string = String.fromCharCode(...array);
        
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

      }
      
      
      
      
      
  return (
    <div>
    
        <h1>Run lit actions</h1>
        
        <div className="flex flex-col gap-3">
            <span>PK: {PUBLIC_KEY}</span>
            <span>Lit Action: {litCID}</span>
            <span>DATA: {dataCID}</span>
            <span>META: {metaCID}</span>
                <button  onClick={e => {runLitCode()}}
                className="btn btn-primary bg-cf-500 p-5 m-5"

                >Run Signatures</button>
                    
        </div>
    </div>
    
    
  )
}
