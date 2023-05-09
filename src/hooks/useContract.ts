import { ethers } from "ethers";
import { useSigner } from "wagmi";
import { DBAbi, DB_NFT_address, crossChainBacalhauJobsAbi, crossChainBacalhauJobs_address } from "../constants";


export const useContract = () => {
    const { data: signer } = useSigner()

    const contract = new ethers.Contract(DB_NFT_address, DBAbi, signer!)
    const contract2 = new ethers.Contract(crossChainBacalhauJobs_address, crossChainBacalhauJobsAbi, signer!)

    const getCurrentTokenId = async() => {
        return await contract.totalSupply()
    }

    const RequestDB = async( dataFormatCID: string, DBname: string, description: string, category: string, requiredRows: number) => {
        //read dataFormatCID from the contract.
        const tx = await contract.RequestDB(dataFormatCID, DBname, description, category, requiredRows, { gasLimit: 1000000 })
        return await tx.wait()
    }

    const submitData = async(tokenId: number, dataCID: String, rows: number) => {
        const tx = await contract.submitData(tokenId, dataCID, rows, { gasLimit: 1000000 })
        return await tx.wait()
    }
    const createDB_NFT = async(tokenId: String, metadataCID: String, mintPrice: number, royaltiesAddress: String) => {
        const price = ethers.utils.parseEther(mintPrice.toString())
        const tx = await contract.createDB_NFT(tokenId, metadataCID,price,royaltiesAddress, { gasLimit: 1000000 })
        return await tx.wait()
    }

    const executeCrossChainBacalhauJob = async(tokenId: number, _spec: String) => {
        const tx = await contract.executeCrossChainBacalhauJob("filecoin", crossChainBacalhauJobs_address, tokenId, _spec, { value: 1, gasLimit: 1000000 })
        return await tx.wait()
    }

    const balanceOf = async(address: string, tokenId: number) => {
        return await contract.balanceOf(address, tokenId)
    }

    const mint = async(tokenid: number, mintPrice: string) => {
        const tx = await contract.mint(tokenid, { value: mintPrice, gasLimit: 1000000 })
        return await tx.wait()
    }
        
    // Fund Bacalhau jobs on hyperspace
    const submitFunds = async(value: number) => {
        const price = ethers.utils.parseEther(value.toString())
        const tx = await contract2.submitFunds({ value: price})
    }

    return {
        getCurrentTokenId,
        RequestDB,
        mint,
        submitData,
        createDB_NFT,
        executeCrossChainBacalhauJob,
        submitFunds,
        balanceOf,
    }
}