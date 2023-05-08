import * as LitJsSdk from "@lit-protocol/lit-node-client";



export default function SignMetadata() {
    
    const runLitActions = async (e) => {
        e.preventDefault();
        const litActionCode = `
          const checkAndSignResponse = async () => {
            const satisfyConditions = await LitActions.checkConditions({ conditions, authSig, chain });
            const currentTimestamp = (new Date()).getTime();
            const afterOneMinute = Math.abs(currentTimestamp - timestamp) >= 2 * 60 * 1000;
            if (!satisfyConditions || afterOneMinute) {
              return;
            }
    
            toSign = { minBalance, fullName, timestamp, currentTimestamp };
            const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
            LitActions.setResponse({ response: JSON.stringify(toSign) });
          };
    
          checkAndSignResponse();
        `;
    
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
        const litNodeClient = new LitJsSdk.LitNodeClient({ litNetwork: "serrano" });
        await litNodeClient.connect();
    
        const date = new Date();
        const dateInString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        const timestamp = new Date(dateInString + " " + 100);
    
        const { signatures, response, logs } = await litNodeClient.executeJs({
          code: litActionCode,
          authSig,
          jsParams: {
            conditions: [
              {
                conditionType: "evmBasic",
                contractAddress: "",
                standardContractType: "",
                chain: "ethereum",
                method: "eth_getBalance",
                parameters: [":userAddress", "latest"],
                returnValueTest: {
                  comparator: ">=",
                  value: `${minBalanceRef.current.value}`,
                },
              },
            ],
            minBalance: minBalanceRef.current.value,
            fullName: nameRef.current.value,
            timestamp: timestamp.getTime(),
            authSig,
            chain: "ethereum",
            publicKey: "0498e4db753aa871f70fa8c29429a4ece3f8f48c3df320bf26bfa3fa135c7f13ecb9036ad1bb873cea0d0cdd082935feb1e547f46323debb1371833bf270f33f28",
            sigName: "sig1",
          },
        });
    
        setReturnedJson(response !== "" ? JSON.stringify(response, null, 4) : "Doesn't satisfy Access Conditions");
        setSignature(response !== "" ? signatures?.sig1?.signature : "Doesn't satisfy Access Conditions");
      };
      
      const code = `
      const go = async () => {
      
        /* wat representation:
        (module 
          (type $0 (func (param i32 i32) (result i32)))
          (memory $0 0)
          (export "add" (func $0))
          (func $0 (type $0) (param $var$0 i32) (param $var$1 i32) (result i32) 
            (i32.add
            (get_local $var$0)
            (get_local $var$1)
            )
          )
        )
        */
        var source = new Uint8Array([
            0, 97, 115, 109, 1,   0, 0,  0,  1,   7,   1,
           96,  2, 127, 127, 1, 127, 3,  2,  1,   0,   5,
            3,  1,   0,   0, 7,   7, 1,  3, 97, 100, 100,
            0,  0,  10,   9, 1,   7, 0, 32,  0,  32,   1,
          106, 11
        ]);
      
        var instance = (await WebAssembly.instantiate(source)).instance;
        var val = instance.exports.add(2, 2);
      
        LitActions.setResponse({response: JSON.stringify(val)})
      };
      
      go();
      `
      function litJsSdkLoaded() {
        var litNodeClient = new LitJsSdk_litNodeClient();
        litNodeClient.connect();
        window.litNodeClient = litNodeClient;
      }
      
      const runLitCode = async () => {
        // you need an AuthSig to auth with the nodes
        // this will get it from metamask or any browser wallet
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
        
        litJsSdkLoaded();
        
        const signatures = await litNodeClient.executeJs({
            ipfsId: "QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm",
            authSig,
            // all jsParams can be used anywhere in your Lit Action Code
            jsParams: {
              // this is the string "Hello World" for testing
              toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
              publicKey:
                "0x0404e12210c57f81617918a5b783e51b6133790eb28a79f141df22519fb97977d2a681cc047f9f1a9b533df480eb2d816fb36606bd7c716e71a179efd53d2a55d1",
              sigName: "sig1",
            },
          });
          
          console.log(signatures);
      };
      
  return (
    <div>
    
        <h1>Run lit actions</h1>
        
        <div>
                <button  
                className="btn btn-primary"
                onClick={runLitActions}>Run Lit Actions</button>
                <button  onClick={e => {runLitCode()}}
                className="btn btn-primary"
                >Run Signatures</button>
                    
        </div>
    </div>
    
    
  )
}
