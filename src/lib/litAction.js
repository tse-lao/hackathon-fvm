import lighthouse from '@lighthouse-web3/sdk';

async function signAuthMessage  (){
  

    const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data.message;
    
    const sigShare = await LitActions.signEcdsa({
        messageRequested,
        publicKey, 
        sigName: "sig1"
      });
      
    return({
      signedMessage: sigShare,
      publicKey: publicKey
    });
  }

const keyObject = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signedMessage
);

const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key);

    await readBlobAsJson(decrypted, (error, json) => {
        if (error) {
            console.error('Failed to read the Blob as JSON:', error);
        } else {
            console.log('Parsed JSON:', json);
            setFileURL(json)
        }
    });


    function readBlobAsJson(blob, callback) {
        const reader = new FileReader();
    
        // Define the onload event handler
        reader.onload = function (event) {
            try {
                const json = JSON.parse(event.target.result);
                callback(null, json);
            } catch (error) {
                callback(error);
            }
        };
    
        // Define the onerror event handler
        reader.onerror = function () {
            callback(reader.error);
        };
    
        // Read the Blob as a text string
        reader.readAsText(blob);
        
        return reader;
    }
    
    function analyzeNode(node, path = []) {
        let structure = {};
        
        let count = 0;
    
        if (Array.isArray(node)) {
          structure.type = 'array';
          count = node.length;
    
          if (node.length > 0) {
            structure.children = analyzeNode(node[0], [...path, '[0]']);
          }
        } else if (typeof node === 'object' && node !== null) {
          structure.type = 'object';
          structure.children = {};
    
          for (const key in node) {
            structure.children[key] = analyzeNode(node[key], [...path, key]);
          }
        } else {
          structure.type = typeof node;
        }
    
        structure.path = path.join('.');
        return structure;
      }
    
      return analyzeNode(json);
    }
        const structure = analyzeJSONStructure(fileURL);
        console.log(structure)
      
        const metadata = await uploadMetadata(JSON.stringify(structure));
        
        
        
        const lighthouseBLSNode = "https://encryption.lighthouse.storage";

        function randRange(min, max) {
            return min + Math.floor(Math.random() * (max - min));
        }
        const randSelect = (k, n) => {
            const a = [];
            let prev = -1;
            for (let i = 0; i < k; i++) {
                let v = randRange(prev + 1, n - (k - i) + 1);
                a.push(v + 1);
                prev = v;
            }
            return a;
        };

        const recoverShards = async (
            address,
            cid,
            signature,
            numOfShards = 3
        ) => {
            try {
                const nodeIndexSelected = randSelect(numOfShards, 5);
                const nodeUrl = nodeIndexSelected.map((elem) =>
                    `${lighthouseBLSNode}/api/retrieveSharedKey/${elem}`
                );
                // send encryption key
                const recoveredShards = await Promise.all(
                    nodeUrl.map((url) => {
                        return axios
                            .post(
                                url,
                                {
                                    address,
                                    cid,
                                },
                                {
                                    headers: {
                                        Authorization: "Bearer " + sigShare,
                                    },
                                }
                            )
                            .then((res) => {
                                return res?.data?.payload;
                            });
                    })
                );
                return {
                    shards: recoveredShards,
                    error: null,
                };
            } catch (err) {
                if (err?.response?.data?.message.includes("null")) {
                    return {
                        shards: [],
                        error: `cid not found`,
                    };
                }
                return {
                    shards: [],
                    error: err?.response?.data || err.message,
                };
            }
        };

        const { error, shards } = await recoverShards(publicKey, cid, signedMessage);

        if (error) {
            console.log(error);
        return;
    }

    let bls = null;
    if (typeof window === "undefined") {
        bls = eval("require")("bls-eth-wasm");
    } else {
        bls = require("bls-eth-wasm/browser");
    }


    const recoverKey = async (keyShards) => {
        if (
            !Array.isArray(keyShards) ||
            !"index" in keyShards[0] ||
            !"key" in keyShards[0]
        ) {
            throw new Error(
                "keyShards must be an array of objects containing these keys [index, key]"
            );
        }
        try {
            let idVec = [];
            let secVec = [];
            await bls.init(bls.BLS12_381);

            keyShards.map((keyShard) => {
                let sk = new bls.SecretKey();
                //convert readable string into secretKey vectors
                sk.deserializeHexStr(keyShard.key);
                secVec.push(sk);

                //convert readable string into Id vectors
                let id = new bls.Id();
                id.deserializeHexStr(keyShard.index);
                idVec.push(id);
            });
            const sec = new bls.SecretKey();

            //recover key
            sec.recover(secVec, idVec);
            let s = sec.serializeToHexStr();
            return { masterKey: s, error: null };
        } catch (err) {
            return { masterKey: null, error: "can't recover Key" };
        }
    };
