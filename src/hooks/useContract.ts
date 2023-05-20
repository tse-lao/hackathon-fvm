import { ethers } from 'ethers'
import { useSigner } from 'wagmi'
import {
  DBAbi,
  DB_NFT_address,
  TWFactoryAbi,
  TWFactoryAddress,
  crossChainBacalhauJobsAbi,
  crossChainBacalhauJobs_address,
  crossChainTablelandDealClientAbi,
  crossChainTablelandDealClientAddress,
  crossChainTablelandStorageAbi,
  crossChainTablelandStorageAddress,
  helper,
  helperAbi,
  splitImplementation,
  splitterAbi
} from '../constants'

export const useContract = () => {
  const { data: signer } = useSigner()

  const provider = new ethers.providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com	")
  const DB_NFT = new ethers.Contract(DB_NFT_address, DBAbi, signer)

  const TablelandStorage = new ethers.Contract(
    crossChainTablelandStorageAddress,
    crossChainTablelandStorageAbi,
    signer
  )

  const TablelandDealClient = new ethers.Contract(
    crossChainTablelandDealClientAddress,
    crossChainTablelandDealClientAbi,
    signer!
  )

  const tablelandBacalhau = new ethers.Contract(
    crossChainBacalhauJobs_address,
    crossChainBacalhauJobsAbi,
    signer
  )
  const TWFactory = new ethers.Contract(TWFactoryAddress, TWFactoryAbi, provider)
  const helperContract = new ethers.Contract(helper, helperAbi, provider)

  // --------------------------------------------------------- DB_NFT_CONTRACT INTERACTIONS -----------------------------------------------------------------------------------------------
  const getCurrentTokenId = async () => {
    return await DB_NFT.totalSupply()
  }

  // Now only contributors that at least one time submitted || only  the owner| NFT holder
  const hasAccess = async (address: string, tokenId: number) => {
    return await DB_NFT.hasAccess(address, tokenId)
  }

  const RequestDB = async (
    dataFormatCID: string,
    DBname: string,
    description: string,
    categories: string[],
    requiredRows: number,
    minimumRowsOnSubmission: number
  ) => {
    //read dataFormatCID from the contract.
    const tx = await DB_NFT.RequestDB(
      dataFormatCID,
      DBname,
      description,
      categories,
      requiredRows,
      minimumRowsOnSubmission,
      { gasLimit: 1000000 }
    )
    return await tx.wait()
  }
  // ================================ CREATING OPEN DATA SET ======================================== //

  const createOpenDataSet = async (
    dbCID: string,
    piece_cid: string,
    dataFormatCID: string,
    dbName: string,
    description: string,
    categories: string[]
  ) => {
    //read dataFormatCID from the contract.
    const tx = await DB_NFT.createOpenDataSet(
      dbCID,
      piece_cid,
      dataFormatCID,
      dbName,
      description,
      categories,
      { gasLimit: 1000000 }
    )
    return await tx.wait()
  }

  // ================================ SUBMITTING DATA AND NFT CREATION ======================================== //
  const submitData = async (
    tokenId: number,
    dataCID: String,
    rows: number,
    v: number,
    r: string,
    s: string
  ) => {
    const tx = await DB_NFT.submitData(tokenId, dataCID, rows, v, r, s, {
      gasLimit: 1000000,
    })
    return await tx.wait()
  }

  //signature:
  const createDB_NFT = async (
    tokenId: String,
    dbCID: String,
    mintPrice: number,
    royaltiesAddress: String,
    v: number,
    r: string,
    s: string
  ) => {
    const price = ethers.utils.parseEther(mintPrice.toString())

    const tx = await DB_NFT.createDB_NFT(
      tokenId,
      dbCID,
      price,
      royaltiesAddress,
      '0x00',
      v,
      r,
      s,
      { gasLimit: 1000000 }
    )
    return await tx.wait()
  }

  const updateDB_NFT = async (
    tokenId: String,
    dbCID: String,
    piece_cid: string,
    v: number,
    r: string,
    s: string
  ) => {
    const tx = await DB_NFT.updateDB_NFT(tokenId, dbCID, piece_cid, v, r, s, {
      gasLimit: 1000000,
    })
    return await tx.wait()
  }

  const balanceOf = async (address: string, tokenId: number) => {
    return await DB_NFT.balanceOf(address, tokenId)
  }

  const mint = async (tokenid: number, mintPrice: string) => {
    const tx = await DB_NFT.mint(tokenid, {
      value: mintPrice,
      gasLimit: 1000000,
    })
    return await tx.wait()
  }

  // --------------------------------------------------- Cross Chain Job and Deals ------------------------------------------------------------------------------------------------------

  // const executeCrossChainBacalhauJob = async (
  //   input: string,
  //   _specStart: String,
  //   _specEnd: string,
  //   jobId: string
  // ) => {
  //   const tx = await crossChainTablelandStorage.executeCrossChainBacalhauJob(
  //     'filecoin',
  //     crossChainBacalhauJobs_address,
  //     input,
  //     _specStart,
  //     _specEnd,
  //     jobId,
  //     { value: ethers.utils.parseEther("1.5"), gasLimit: 1000000 }
  //   )
  //   return await tx.wait()
  // }

  // const createCrossChainDealRequest = async (
  //   piece_cid: string,
  //   label: String,
  //   piece_size: number,
  //   end_epoch: number,
  //   location_ref: string,
  //   car_size: number
  // ) => {
  //   const tx = await crossChainTablelandStorage.createCrossChainDealRequest(
  //     'filecoin',
  //     crossChainTablelandDealClientAddress,
  //     piece_cid,
  //     label,
  //     piece_size,
  //     end_epoch,
  //     location_ref,
  //     car_size,
  //     { value: ethers.utils.parseEther("1.5"), gasLimit: 1000000 }
  //   )
  //   return await tx.wait()
  // }

  // Fund Bacalhau jobs on hyperspace
  const submitFunds = async (value: number) => {
    const price = ethers.utils.parseEther(value.toString())
    const tx = await tablelandBacalhau.submitFunds({ value: price })
    return await tx.wait()
  }

  const callLillypadJob = async (
    _specStart: string,
    input: string,
    _specEnd
  ) => {
    const tx = await tablelandBacalhau.executeJOB(input, _specStart, _specEnd)
    return await tx.wait()
  }

  // --------------------------------------------------- crossChainTablelandDealClient ------------------------------------------------------------------------------------------------------

  const makeDealProposal = async (
    locationRef: string,
    carSize: number,
    cidHex: string,
    pieceSize: number,
    label: string,
    startEpoch: number
  ) => {
    let DealRequestStruct = [
      cidHex,
      pieceSize,
      false,
      label,
      startEpoch,
      1050026,
      0,
      0,
      0,
      1,
      [locationRef, carSize, false, false],
    ]
    const tx = await TablelandDealClient.makeDealProposal(DealRequestStruct)
    return await tx.wait()
  }

  // --------------------------------------------------------- ThirdWeb CreateSplitter & Interact with a Splitter  -----------------------------------------------------------------------------------------------

  // get internal transaction by transaction hash to get the deployed splitter contract  https://docs.polygonscan.com/v/mumbai-polygonscan/api-endpoints/accounts#get-internal-transactions-by-transaction-hash
  const CreateSpitter = async (
    defaultAdmin: string,
    _payees: string[],
    _shares: string[]
  ) => {
    var bytecode = '0xb1a14437'
    var initCode = await helperContract.getInitCode(
      bytecode,
      defaultAdmin,
      [],
      _payees,
      _shares
    )
    var salt = randomSalt()
    const tx = await TWFactory.deployProxyByImplementation(
      splitImplementation,
      initCode,
      salt
    )
    return await tx.wait()
  }

  const randomSalt = async () => {
    return await ethers.utils.randomBytes(32)
  }

  const getPayeesCount = async (splitterAddress: string) => {
    var splitterInstance = new ethers.Contract(
      splitterAddress,
      splitterAbi,
      provider
    )
    return await splitterInstance.payeeCount()
  }

  const getPayee = async (splitterAddress: string, index: number) => {
    var splitterInstance = new ethers.Contract(
      splitterAddress,
      splitterAbi,
      provider
    )
    return await splitterInstance.payee(index)
  }

  const getPayeeShares = async (splitterAddress: string, address: string) => {
    var splitterInstance = new ethers.Contract(
      splitterAddress,
      splitterAbi,
      provider
    )
    return await splitterInstance.shares(address)
  }

  const distributeShares = async (splitterAddress: string) => {
    var splitterInstance = new ethers.Contract(
      splitterAddress,
      splitterAbi,
      provider
    )
    const tx = await splitterInstance.distribute()

    
    return await tx.wait()
  }
  
  const getBalance = async (address:string) => {
    const balance = await provider.getBalance(address);

    return ethers.utils.formatEther(balance);
  };
  
  

  return {
    getCurrentTokenId,
    createOpenDataSet,
    getBalance, 
    updateDB_NFT,
    RequestDB,
    mint,
    submitData,
    createDB_NFT,
    callLillypadJob,
    submitFunds,
    balanceOf,
    hasAccess,
    CreateSpitter,
    getPayeesCount,
    getPayee,
    getPayeeShares,
    distributeShares,
    makeDealProposal,
  }
}
