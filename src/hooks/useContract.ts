import { ethers } from "ethers";
import { useSigner } from "wagmi";
import { DBAbi, DB_NFT_address, TWFactoryAbi, TWFactoryAddress, crossChainBacalhauJobsAbi, crossChainBacalhauJobs_address, helper, helperAbi, splitImplementation, splitterAbi } from "../constants";


export const useContract = () => {
    const { data: signer } = useSigner()

    const contract = new ethers.Contract(DB_NFT_address, DBAbi, signer!)
    const contract2 = new ethers.Contract(crossChainBacalhauJobs_address, crossChainBacalhauJobsAbi, signer!)
    const TWFactory = new ethers.Contract(TWFactoryAddress, TWFactoryAbi, signer!)
    const helperContract = new ethers.Contract(helper, helperAbi,signer!)


    const getCurrentTokenId = async() => {
        return await contract.totalSupply()
    }

    // Now only contributors that at least one time submitted || only  the owner| NFT holder
    const hasAccess = async(address: string, tokenId: number) => {
        return await contract.hasAccess(address, tokenId)
    }

    const RequestDB = async( dataFormatCID: string, DBname: string, description: string, categories: string[], requiredRows: number, minimumRowsOnSubmission:number) => {
        //read dataFormatCID from the contract.
        const tx = await contract.RequestDB(dataFormatCID, DBname, description, categories, requiredRows,minimumRowsOnSubmission, { gasLimit: 1000000 })
        return await tx.wait()
    }


    const randomSalt = async() => {
        return await ethers.utils.randomBytes(32);
    }

    // get internal transaction by transaction hash to get the deployed splitter contract  https://docs.polygonscan.com/v/mumbai-polygonscan/api-endpoints/accounts#get-internal-transactions-by-transaction-hash
    const CreateSpitter = async(defaultAdmin : string, _payees : string[], _shares: string[])=>{
        var bytecode = "0xb1a14437"
        var initCode = await helperContract.getInitCode(bytecode,defaultAdmin,[],_payees,_shares);
        var salt = randomSalt();
        const tx = await TWFactory.deployProxyByImplementation(splitImplementation,initCode,salt );
        return await tx.wait();
    }

    const getPayeesCount = async(splitterAddress: string, ) => {
        var splitterInstance = new ethers.Contract(splitterAddress, splitterAbi,signer!)
        return await splitterInstance.payeeCount()

    }

    const getPayee = async(splitterAddress: string, index: number) => {
        var splitterInstance = new ethers.Contract(splitterAddress, splitterAbi,signer!)
        return await splitterInstance.payee(index)
    }

    const getPayeeShares = async(splitterAddress: string, address: string ) => {
        var splitterInstance = new ethers.Contract(splitterAddress, splitterAbi,signer!)
        return await splitterInstance.shares(address)
    }

    const distributeShares = async(splitterAddress: string,) => {
        var splitterInstance = new ethers.Contract(splitterAddress, splitterAbi,signer!)
        const tx = await splitterInstance.distribute()
    }


    const submitData = async(tokenId: number, dataCID: String, rows: number, v: number, r: string,  s: string) => {
        const tx = await contract.submitData(tokenId, dataCID, rows, v , r , s, { gasLimit: 1000000 })
        return await tx.wait()
    }


    //signature: 
    const createDB_NFT = async(tokenId: String, dbCID: String, mintPrice: number, royaltiesAddress: String, v: number, r: string,  s: string) => {
        const price = ethers.utils.parseEther(mintPrice.toString())
    
        const tx = await contract.createDB_NFT(tokenId, dbCID, price, royaltiesAddress, "0x00", v , r , s, { gasLimit: 1000000 })
        return await tx.wait()
    }
    //  1. prepping <= data offchain
    // 2. compute data offchain 
    
    

    //NOT WORKING AT ALL == lilypad
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
        hasAccess,
        CreateSpitter,
        getPayeesCount,
        getPayee,
        getPayeeShares,
        distributeShares
    }
}