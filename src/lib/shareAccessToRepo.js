import { getSignature } from "@/hooks/useLitProtocol";
import { ethers } from "ethers";
import MerkleTree from "merkletreejs";

export async function shareAccessToRepo(token, cid, address){
    const access = await fetchAccess(token); 
    //change array to array of addresses.
    const myIndex = access.findIndex((item) => item.address === address);
    const addressArray = access.map((item) => item.address);
    const count = addressArray.length;
    
    const hexProof = await getHexProof(addressArray, myIndex);

    
    const signedString = token.concat("", cid).concat("", count);
    const getData = await getSignature(signedString);
    console.log(getData)
    
    return {token: token, cid:cid, count:count, array:addressArray, index:myIndex, v:getData.v, r:getData.r, s:getData.s, hex:hexProof};
    
}

const fetchAccess = async (token) => {
    const result = await fetch(`/api/tableland/merkle/access?where= WHERE tokenID=${token} AND AccessFor='SUBMIT'`)
    const data = await result.json();
    console.log(data)

    return data.result;
  }
  
  const getHexProof = async (arrayAddress, myIndex) => {
    // hasRepoAccess(tokenId, accessProof, index)
    const AccessSubmitleaves = arrayAddress.map((x) => ethers.utils.keccak256(x))
    const SubmitTree = new MerkleTree(
      AccessSubmitleaves,
      ethers.utils.keccak256,
      { sortPairs: true }
    )
    const hexProof = SubmitTree.getHexProof(AccessSubmitleaves[myIndex])

    return hexProof;
  }
  
  const applyAccessConditions = async (cid) => {
    const result = await getHexProof();
    console.log(result);
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
        parameters: [id, result, ":userAddress"],
        inputArrayType: ["uint256", "bytes32[]", "address"],
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
