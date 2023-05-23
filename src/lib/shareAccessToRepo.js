import { DB_NFT_address } from "@/constants";
import { readJWT } from "@/hooks/useLighthouse";
import { getSignature } from "@/hooks/useLitProtocol";
import lighthouse from "@lighthouse-web3/sdk";

export async function shareAccessToRepo(token, cid, address){
    const access = await fetchAccess(token); 
    //change array to array of addresses.
    const myIndex = access.findIndex((item) => item.address.toLowerCase() === address.toLowerCase());
    const addressArray = access.map((item) => item.address.toLowerCase());
    const count = addressArray.length;
    
    const signedString = token.concat("", cid).concat("", count);
    const getData = await getSignature(signedString);
    console.log(getData)
    
    const accessConditions = await applyAccessConditions(token, cid, address);
  console.log(accessConditions)
    
    return {token: token, cid:cid, count:count, array:addressArray, index:myIndex, v:getData.v, r:getData.r, s:getData.s};
    
}

const fetchAccess = async (token) => {
    const result = await fetch(`/api/tableland/merkle/access?where= WHERE tokenID=${token} AND AccessFor='SUBMIT'`)
    const data = await result.json();
    console.log(data)

    return data.result;
  }
  

  
  const applyAccessConditions = async (id, cid, address) => {
    const conditions = [
      {
        id: 1,
        chain: "Mumbai",
        method: "hasRepoAccess",
        standardContractType: "Custom",
        contractAddress: DB_NFT_address,
        returnValueTest: {
          comparator: "==",
          value: "true"
        },
        parameters: [":userAddress", id],
        inputArrayType: ["address", "uint256"],
        outputType: "bool"
      }
    ];
    
    const aggregator = "([1])";
    const jwt = await readJWT(address);
    
    console.log(cid);
    
    const response = await lighthouse.applyAccessCondition(
      address,
      cid,
      jwt,
      conditions,
      aggregator
    );

    console.log(response)

    return response;
    /*
      {
        data: {
          cid: "QmZkEMF5y5Pq3n291fG45oyrmX8bwRh319MYvj7V4W4tNh",
          status: "Success"
        }
      }
    */
  }
