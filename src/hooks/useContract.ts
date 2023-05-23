import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useSigner } from 'wagmi'
import { MerkleTree } from 'merkletreejs'
import { SHA256 } from 'crypto-js'

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
  crossChainTablelandDealRewarderAbi,
  crossChainTablelandDealRewarderAddress,
  helper,
  helperAbi,
  splitImplementation,
  splitterAbi,
} from '../constants'

export const useContract = () => {
  const { data: signer } = useSigner()

  const provider = new ethers.providers.JsonRpcProvider(
    'https://matic-mumbai.chainstacklabs.com	'
  )
  const DB_NFT = new ethers.Contract(DB_NFT_address, DBAbi, signer!)

  const TablelandStorage = new ethers.Contract(
    crossChainTablelandStorageAddress,
    crossChainTablelandStorageAbi,
    signer!
  )

  const TablelandBountyRewarder = new ethers.Contract(
    crossChainTablelandDealRewarderAddress,
    crossChainTablelandDealRewarderAbi,
    signer!
  )

  const TablelandDealClient = new ethers.Contract(
    crossChainTablelandDealClientAddress,
    crossChainTablelandDealClientAbi,
    signer!
  )

  const tablelandBacalhau = new ethers.Contract(
    crossChainBacalhauJobs_address,
    crossChainBacalhauJobsAbi,
    signer!
  )
  const TWFactory = new ethers.Contract(TWFactoryAddress, TWFactoryAbi, signer!)
  const helperContract = new ethers.Contract(helper, helperAbi, signer!)

  // --------------------------------------------------------- DB_NFT_CONTRACT INTERACTIONS -----------------------------------------------------------------------------------------------
  const getCurrentTokenId = async () => {
    return await DB_NFT.totalSupply()
  }

  // Now only contributors that at least one time submitted || only  the owner| NFT holder
  const hasAccess = async (address: string, tokenId: number) => {
    return await DB_NFT.hasAccess(address, tokenId)
  }

  const hasRepoAccess = async (
    address:string,
    tokenId: number
  ) => {
    return await DB_NFT.hasRepoAccess(address, tokenId)
  }

  const RequestDB = async (
    dataFormatCID: string,
    DBname: string,
    description: string,
    categories: string[],
    requiredRows: number,
    minimumRowsOnSubmission: number
  ): Promise<any> => {
    try {
      const tx = await DB_NFT.RequestDB(
        dataFormatCID,
        DBname,
        description,
        categories,
        requiredRows,
        minimumRowsOnSubmission,
        { gasLimit: 1000000 }
      )

      console.log(tx)
      toast.update('Promise is pending', {
        render: 'Transaction sent, waiting for confirmation.',
      })

      const receipt = await tx.wait()
      console.log(receipt)
      toast.success('Promise resolved 👌')
      return receipt
    } catch (error) {
      console.log(error)
      toast.error('Promise rejected 🤯')
      throw error
    }
  }
  // ================================ CREATING OPEN DATA SET and Private Repos using Merkle Trees ======================================== //

  const createOpenDataSet = async (
    dbCID: string,
    label: string,
    dataFormatCID: string,
    dbName: string,
    description: string,
    categories: string[]
  ) => {
    //read dataFormatCID from the contract.
    const tx = await DB_NFT.createOpenDataSet(
      dbCID,
      label,
      dataFormatCID,
      dbName,
      description,
      categories,
      { gasLimit: 1000000 }
    )
    return await tx.wait()
  }

  const createPrivateRepo = async (
    repoName: string,
    description: string,
    SubmitProof: string[]
  ) => {

    const AccessSubmitleaves = SubmitProof.map((x) => ethers.utils.keccak256(x))
    const SubmitTree = new MerkleTree(
      AccessSubmitleaves,
      ethers.utils.keccak256,
      { sortPairs: true }
    )
    const SubmitRoot = SubmitTree.getHexRoot()

    const tx = await DB_NFT.createPrivateRepo(
      repoName,
      description,
      SubmitProof,
      SubmitRoot,
      { gasLimit: 1000000 }
    )
    return await tx.wait()
  }


  const updateRepoSubmitAccessControl = async (
    tokenId: number,
    SubmitProof: string[]
  ) => {
    const AccessSubmitleaves = SubmitProof.map((x) => ethers.utils.keccak256(x))
    const SubmitTree = new MerkleTree(
      AccessSubmitleaves,
      ethers.utils.keccak256,
      { sortPairs: true }
    )
    const SubmitRoot = SubmitTree.getHexRoot()

    const tx = await DB_NFT.setRepoSubmitAccess(
      tokenId,
      SubmitProof,
      SubmitRoot,
      { gasLimit: 1000000 }
    )
    return await tx.wait()
  }

  // ================================ SUBMITTING DATA AND NFT CREATION ======================================== //
  const submitData = async (
    tokenId: number,
    dataCID: String,
    rows: number,
    SubmitProof: string[],
    index: number,
    v: number,
    r: string,
    s: string
  ): Promise<any> => {
    if (SubmitProof.length > 0) {
      const AccessSubmitleaves = SubmitProof.map((x) =>
        ethers.utils.keccak256(x)
      )
      const SubmitTree = new MerkleTree(
        AccessSubmitleaves,
        ethers.utils.keccak256,
        { sortPairs: true }
      )
      const hexProof = SubmitTree.getHexProof(AccessSubmitleaves[index])
      SubmitProof = hexProof
    }
    try {
      const tx = await DB_NFT.contribute(
        tokenId,
        dataCID,
        rows,
        SubmitProof,
        v,
        r,
        s,
        {
          gasLimit: 1000000,
        }
      )

      console.log(tx)
      toast.update('Promise is pending', {
        render: 'Transaction sent, waiting for confirmation.',
      })

      const receipt = await tx.wait()
      console.log(receipt)
      toast.success('Promise resolved 👌')
      return receipt
    } catch (error) {
      console.log(error)
      toast.error('Promise rejected 🤯')
      throw error
    }
  }

  //signature:
  const createDB_NFT = async (
    tokenId: String,
    dbCID: String,
    mintPrice: number,
    royaltiesAddress: String,
    payLoad: String,
    v: number,
    r: string,
    s: string
  ): Promise<any> => {
    const price = ethers.utils.parseEther(mintPrice.toString())

    try {
      const tx = await DB_NFT.createDBNFT(
        tokenId,
        dbCID,
        price,
        royaltiesAddress,
        payLoad,
        v,
        r,
        s,
        { gasLimit: 1000000 }
      )
      console.log(tx)
      toast.update('Promise is pending', {
        render: 'Transaction sent, waiting for confirmation.',
      })

      const receipt = await tx.wait()
      console.log(receipt)
      toast.success('Promise resolved 👌')
      return receipt
    } catch (error) {
      console.log(error)
      toast.error('Promise rejected 🤯')
      throw error
    }
  }

  const updateDB_NFT = async (
    tokenId: String,
    dbCID: String,
    piece_cid: string,
    v: number,
    r: string,
    s: string
  ) => {
    const tx = await DB_NFT.updateDB(tokenId, dbCID, piece_cid, v, r, s, {
      gasLimit: 1000000,
    })
    return await tx.wait()
  }

  const balanceOf = async (address: string, tokenId: number) => {
    return await DB_NFT.balanceOf(address, tokenId)
  }

  const mint = async (tokenid: number, mintPrice: string) => {
    const tx = await DB_NFT.mintDB(tokenid, {
      value: mintPrice,
      gasLimit: 1000000,
    })
    return await tx.wait()
  }

  // --------------------------------------------------- HyperSpace Compute Over Data x Tableland ------------------------------------------------------------------------------------------------------

  const callLillypadJob = async (
    input: string,
    _specStart: string,
    _specEnd: string,
    jobId: string
  ): Promise<any> => {
    try {
      const tx = await tablelandBacalhau.executeJOB(
        input,
        _specStart,
        _specEnd,
        jobId,
        {
          gasLimit: 100000000,
        }
      )
      console.log(tx)
      toast.update('Promise is pending', {
        render: 'Transaction sent, waiting for confirmation.',
      })

      const receipt = await tx.wait()
      console.log(receipt)
      toast.success('Promise resolved 👌')
      return receipt
    } catch (error) {
      console.log(error)
      toast.error('Promise rejected 🤯')
      throw error
    }
  }

  // Fund Bacalhau jobs on hyperspace
  const submitFunds = async (value: number) => {
    const price = ethers.utils.parseEther(value.toString())
    const tx = await tablelandBacalhau.submitFunds({ value: price })
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
  ): Promise<any> => {
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
    try {
      const tx = await TablelandDealClient.makeDealProposal(DealRequestStruct)
      console.log(tx)
      toast.update('Promise is pending', {
        render: 'Transaction sent, waiting for confirmation.',
      })

      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      toast.error('Promise rejected 🤯')
      throw error
    }
  }

  const createBounty = async (
    label: string,
    cidHex: string,
    location_ref: number,
    size: string
  ): Promise<any> => {
    try {
      const tx = await TablelandBountyRewarder.createBounty(
        label,
        cidHex,
        location_ref,
        size
      )
      console.log(tx)
      toast.update('Promise is pending', {
        render: 'Transaction sent, waiting for confirmation.',
      })

      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      toast.error('Promise rejected 🤯')
      throw error
    }
  }

  const claimBounty = async (dealID: number): Promise<any> => {
    try {
      const tx = await TablelandBountyRewarder.claim(dealID)
      console.log(tx)
      toast.update('Promise is pending', {
        render: 'Transaction sent, waiting for confirmation.',
      })

      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      toast.error('Promise rejected 🤯')
      throw error
    }
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

  //TODO: there is an error here we need to find out what the problem is..
  const distributeShares = async (
    splitterAddress: string,
    address: string
  ): Promise<any> => {
    var splitterInstance = new ethers.Contract(
      splitterAddress,
      splitterAbi,
      signer!
    )

    console.log(splitterInstance)
    try {
      const tx = await splitterInstance.distribute()

      console.log(tx)
      toast.update('Promise is pending', {
        render: 'Transaction sent, waiting for confirmation.',
      })

      const receipt = await tx.wait()
      console.log(receipt)
      return receipt
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const getBalance = async (address: string) => {
    const balance = await provider.getBalance(address)

    return ethers.utils.formatEther(balance)
  }

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
    hasRepoAccess,
    createPrivateRepo,
    updateRepoSubmitAccessControl,
    claimBounty,
    createBounty,
  }
}