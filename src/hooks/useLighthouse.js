import { DB_NFT_address } from '@/constants/contractAddress';
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


export async function shareFile(cid, creator) {

  // Then get auth message and sign
  // Note: the owner of the file should sign the message.
  const { publicKey, signedMessage } = await signAuthMessage();

  const publicVerifier = "0xf129b0D559CFFc195a3C225cdBaDB44c26660B60"

  const publicKeyUserB = [creator, publicVerifier];

  const res = await lighthouse.shareFile(
    publicKey,
    publicKeyUserB,
    cid,
    signedMessage
  );

  console.log(res)

  return res;
  /*
    data: {
      cid: "QmTTa7rm2nMjz6wCj9pvRsadrCKyDXm5Vmd2YyBubCvGPi",
      shareTo: ["0x201Bcc3217E5AA8e803B41d1F5B6695fFEbD5CeD"],
      status: "Success"
    }
  */
  /*Visit: 
      https://files.lighthouse.storage/viewFile/<cid>  
    To view encrypted file
  */
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

export async function createJWTToken(publicKey, signedMessage) {
  
  if(!publicKey || !signedMessage) {
    const { signedMessage, publicKey } = await signAuthMessage();
    const response = await getJWT(publicKey, signedMessage);

    return response.JWT;
  }
  const response = await getJWT(publicKey, signedMessage);

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

    const url = "https://api.lighthouse.storage"
    const sec = "https://data-depot.lighthouse.storage/api"
    const endpoint = `${sec}/upload/upload_files`

    console.log(accessToken)
    /*   let response = await fetch(
        `${sec}/upload/upload_files`,
        form,
        config,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          },  
        }
      ); */

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
export async function getUploads(accessToken) {
  return new Promise(async (resolve, reject) => {
    try {

      const sec = "https://data-depot.lighthouse.storage/api"
      const endpoint = `${sec}/data/get_user_uploads?pageNo=1`


      let check = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      })


      const result = await check.json()
      console.log(result)
      resolve(result)


    } catch (error) {
      console.log(`Something Went Wrong : ${error}`, "error");
      reject(error)
    }
  });
}

export async function downloadNFT(cid, address, tokenId) {
  const { signedMessage, publicKey } = await signAuthMessage(address);

  const keyObject = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signedMessage
  );

  const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key);

  const date = getCurrentDateAsString();

  const fileName = `token-${tokenId}-${date}.json`;

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
