import { DBAbi, DB_NFT_address } from "@/constants";
import { ethers } from "ethers";
const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai-bor.publicnode.com");
const contract = new ethers.Contract(DB_NFT_address, DBAbi, provider)

export default async (req, res) => {
    const { address, id } = req.query;

    console.log(address, id)
    const result = await new Promise(async (resolve, reject) => {

        try {
            const response = await contract.hasAccess(address, id)
            console.log(response)
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

      console.log(result)
    res.status(200).json(result);
  }