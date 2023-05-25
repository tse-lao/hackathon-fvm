import { DB_NFT_address } from '@/constants/contractAddress';
import { readBlobAsJson } from '@/lib/dataHelper';
import { getCurrentDateAsString } from '@/lib/helpers';
import { getJWT } from '@lighthouse-web3/kavach';
import lighthouse from '@lighthouse-web3/sdk';
import { fetchSigner } from '@wagmi/core';
import MatchRecord from './useBlockchain';



export async function signAuthMessage() {
  const signer = await fetchSigner();
  
  console.log(signer);
  const address = await signer.getAddress();
  const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
  const signedMessage = await signer.signMessage(messageRequested);


  return ({
    signedMessage: signedMessage,
    publicKey: address
  });
}

export async function shareFile(cid, creator, address) {

  let jwt = await readJWT(address);
  const publicVerifier = "0xf129b0D559CFFc195a3C225cdBaDB44c26660B60"
  const publicKeyUserB = [creator, publicVerifier];

  const res = await lighthouse.shareFile(
    address,
    publicKeyUserB,
    cid,
    jwt
  );
  return res;
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

  const { signedMessage, publicKey } = await signAuthMessage()
  const response = await lighthouse.applyAccessCondition(
    publicKey,
    cid,
    signedMessage,
    conditions,
    aggregator
  )


  return response;
}

export async function readJWT(address) {
  
  
  const jwt = localStorage.getItem(`lighthouse-jwt-${address}`);
  
  
if(jwt && jwt !== null) { 
  console.log(jwt);
  return jwt 
  }
  
  const { signedMessage, publicKey } = await signAuthMessage();
  const response = await getJWT(publicKey, signedMessage);
  localStorage.setItem(`lighthouse-jwt-${address}`, response.JWT);

  return response.JWT;
}

export async function uploadCarFile(
  uploadedFiles,
  setUploadedProgress,
  accessToken
) {
  try {
    var form = new FormData();
    uploadedFiles.map((item) => {
      form.append("file", item);
    });

    const url = "https://data-depot.lighthouse.storage/api"
    const endpoint = `${url}/upload/upload_files`

    console.log(endpoint)
    let check = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form
    })

    const result = await check.json()
    
    resolve(result)

  } catch (error) {
    console.log(error)
  }
};

//alternative way of getting the uploads. 
export async function getUploads(accessToken, page) {
  return new Promise(async (resolve, reject) => {
    try {

      const sec = "https://data-depot.lighthouse.storage/api"
      const endpoint = `${sec}/data/get_user_uploads?pageNo=${page}`


      let check = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      })


      const result = await check.json()
      resolve(result)


    } catch (error) {
      console.log(`Something Went Wrong : ${error}`, "error");
      reject(error)
    }
  });
}

export async function downloadCid(cid, address, tokenId) {
  const jwt = await readJWT(address);

  const keyObject = await lighthouse.fetchEncryptionKey(
    cid,
    address,
    jwt
  );

  const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key);

  const date = getCurrentDateAsString();

  const fileName = `token-${tokenId}-${date}.json`;
  
  console.log(fileName)

  downloadBlob(decrypted, fileName);
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  // Make the link invisible, but append it to the document
  link.style.display = 'none';
  document.body.appendChild(link);

  // Start the download and immediately revoke the URL
  link.click();
  URL.revokeObjectURL(url);

  // Remove the link after a short delay (optional)
  setTimeout(() => {
    document.body.removeChild(link);
  }, 1000); // Delay in milliseconds (adjust as needed)
}
function getFirstArray(obj) {
  for (let key in obj) {
      if (Array.isArray(obj[key])) {
          return obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          let nestedResult = getFirstArray(obj[key]);
          if (nestedResult) {
              return nestedResult;
          }
      }
  }
  return null;
}

export async function countRows(cid, address){
  let jwt = await readJWT(address);
  const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      address,
      jwt
    );

  const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key);
  console.log(decrypted)
  const jsonData = await readBlobAsJson(decrypted);
  
  //check if hte jsonData is an array 
  if(Array.isArray(jsonData)){
    return jsonData.length;
  }
  
  //get the first array in jsonData if not then just reutnr 1
  
  if(containsArray(jsonData)){
    let firstArray = getFirstArray(jsonData);
    return firstArray.length;
  } else {
    return 1;
  }
  
  
  let count = jsonData.length;
  
  return count;
}

function containsArray(obj) {
  for (let key in obj) {
      if (Array.isArray(obj[key])) {
          return true;
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (containsArray(obj[key])) {
              return true;
          }
      }
  }
  return false;
}

export default async function getApiKey (){
  const {signedMessage, publicKey} = await signAuthMessage()

  console.log(signedMessage);

  
  const response = await lighthouse.getApiKey(publicKey, signedMessage);
  console.log(response);
  
  await localStorage.setItem("lighthouse", response.data.apiKey)

  return response.data.apiKey;
  /* { data: { apiKey: '7d8f3d18.eda91521aa294773a8201d2a7d241a2c' } } */
}

export async function getLighthouse(address) {
  let api = await localStorage.getItem(`lighthouse-${address}`)
  console.log(api);
  
  if(!api){
      //redirect to settings page. 
      const result = await getApiKey();
      return result;
  }
  return api;
}

export const getDataDepoAuth = async (address) => {
  try {
      const apiKey = await getLighthouse(address);
      return await lighthouse.dataDepotAuth(apiKey);
  } catch (error) {
      console.error('Error getting auth token:', error);
      throw new Error('Failed to authenticate. Please try again.');
  }
};

export async function uploadCarFileFromCid(cid, address, metadata, fileName) {
  //we want to prepare the cid for upload by reading turning it into file 
  
  let endpoint = `https://gateway.lighthouse.storage/ipfs/${cid}`;
  console.log(endpoint)
  let blob = await fetchWithRetry(endpoint, 5000, 5);
  
  console.log(blob)
  const accessToken = await getDataDepoAuth(address);
  const access = accessToken.data.access_token
  //prepae the file for upload
  const file = new File([blob], cid, {type: "text/plain"});

  const result = await uploadCarFile([file], setUploadedProgress, access);
  
  console.log(result);
  //now if its success we can go and match it 
  
  let open = true
  //wait here for a bit
  let newMetadata = metadata;
  let name = fileName
  
  if(!metadata){
    newMetadata = "added_manually_by_encryption"
    open = false
  }
  if(!fileName){
    name = cid
  }
  
  await sleep(5000);
  const polybaseRecord = await MatchRecord([{name: name, cid: cid, metadata: newMetadata, type: "text/plain"}], access, open);
  
  console.log(polybaseRecord)
  return polybaseRecord
  
}



async function setUploadedProgress (progress) {
  console.log(progress)
}
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchWithRetry(endpoint, delay = 1000, maxRetries = 3) {
  let retries = 0;
  let blob = null;

  while (retries < maxRetries && !blob) {
    try {
      blob = await fetch(endpoint).then(r => r.blob());
    } catch (error) {
      console.log(`Error occurred: ${error}`);
    }

    if (!blob) {
      retries++;
      console.log(`Retrying in ${delay} milliseconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return blob;
}
/* 
async function readBlobFromEndpoint(endpointUrl) {
  // Create a new XMLHttpRequest object
  console.log("waiting for reading...")
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", endpointUrl, true);
    xhr.responseType = "blob";

    xhr.onload = function() {
      if (xhr.status === 200) {
        var blob = xhr.response;
        var reader = new FileReader();

        reader.onload = function(event) {
          var fileContent = event.target.result;
          console.log("File content:", fileContent);
          resolve(fileContent);
        };

        reader.readAsText(blob);
      } else {
        console.error("Error occurred while reading the blob:", xhr.status);
        reject(xhr.status);
      }
    };

    xhr.send();
  });
}
 */