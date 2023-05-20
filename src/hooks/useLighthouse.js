import { DB_NFT_address } from '@/constants/contractAddress';
import { readBlobAsJson } from '@/lib/dataHelper';
import { getCurrentDateAsString } from '@/lib/helpers';
import { getJWT } from '@lighthouse-web3/kavach';
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';

export async function signAuthMessage() {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
  const signedMessage = await signer.signMessage(messageRequested);


  return ({
    signedMessage: signedMessage,
    publicKey: address
  });
}

export async function shareFile(cid, creator, address) {

  let jwt = await getJWT(address);
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
  
  if(jwt) { return jwt }
  
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

    const config = {
      onUploadProgress: (progressEvent) => {
        let percentageUploaded =
          (progressEvent?.loaded / progressEvent?.total) * 100;

        setUploadedProgress(percentageUploaded.toFixed(2));
      },
    };

    const sec = "https://data-depot.lighthouse.storage/api"
    const endpoint = `${sec}/upload/upload_files`

    let check = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form
    })

    console.log(check)

    const result = await check.json()
    console.log(result)


  } catch (error) {
    console.log(`Something Went Wrong : ${error}`, "error");
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

export async function countRows(cid, address){
  let jwt = await readJWT(address);
  const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      address,
      jwt
    );

  const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key);
  const jsonData = await readBlobAsJson(decrypted);
  
  let count = jsonData.length;
  
  return count;
}

export default async function getApiKey (){
  const {signedMessage, publicKey} = await signAuthMessage()

  console.log(signedMessage);
  console.log(publicKey);

  
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

