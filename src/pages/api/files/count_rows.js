import lighthouse from '@lighthouse-web3/sdk';

// pages/api/myFunction.js
export default async (req, res) => {
    // Here you continue the function in the backend
    // ... Run your backend function and assign the result to `result` variable
    // Return the result
    const {cid, jwt, address }= req.query;
    
    //we decrypt the file and then count it 
    
    console.log(cid, jwt, address)

    const keyObject = await lighthouse.fetchEncryptionKey(
        cid,
        address,
        jwt
      );

    const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key);
    console.log(decrypted);
    let decoder = new TextDecoder('utf8');
    let jsonString = decoder.decode(decrypted);
    let jsonData = JSON.parse(jsonString);
    
    let count = jsonData.length;
    console.log(count)
    
    
    
    
    res.status(200).json(count);
  }
  