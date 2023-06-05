import { ethers } from 'ethers'
import { MerkleTree } from 'merkletreejs'
import { toast } from 'react-toastify'
import { useProvider, useSigner } from 'wagmi'

import {
  DBAbi,
  DB_NFT_address,
  EncodeHelper,
  HyperspaceEscrow,
  MultisigAbi,
  MultisigFactory,
  MultisigFactoryAbi,
  MumbaiEscrow,
  TWFactoryAbi,
  TWFactoryAddress,
  crossChainBacalhauJobsAbi,
  crossChainBacalhauJobs_address,
  crossChainTablelandDealClientAbi,
  crossChainTablelandDealClientAddress,
  crossChainTablelandDealRewarderAbi,
  crossChainTablelandDealRewarderAddress,
  encodeHelperAbi,
  escrowAbi,
  helper,
  helperAbi,
  splitImplementation,
  splitterAbi
} from '../constants'

export const useContract = () => {
  const { data: signer } = useSigner()

  const provider = useProvider()
  const DB_NFT = new ethers.Contract(DB_NFT_address, DBAbi, signer!)


  const Helper = new ethers.Contract(
    EncodeHelper,
    encodeHelperAbi,
    signer!
  )

  const multisigFactory = new ethers.Contract(
    MultisigFactory,
    MultisigFactoryAbi,
    signer!
  )

  const Hyperspaceescrow = new ethers.Contract(
    HyperspaceEscrow,
    escrowAbi,
    signer!
  )

  const Mumbaiescrow = new ethers.Contract(MumbaiEscrow, escrowAbi, signer!)

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

  // ----------------------------------------------------------- Escrows -------------------------------------------------------------------------------------------------------------

  const fundUserMumbai = async (address: string) => {
    try {
      let tx = await Mumbaiescrow.withdraw(address)
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

  const fundEscrowMumbai = async (valueToFund:number) => {
    try {
      let tx = await Mumbaiescrow.fund({value:ethers.utils.parseEther(valueToFund.toString())})
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


  const fundUserHyperspace = async (address: string) => {
    try {
      let tx = await Hyperspaceescrow.withdraw(address)
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


  const fundEscrowHyperspace = async (valueToFund:number) => {
    try {
      let tx = await Hyperspaceescrow.fund({value:ethers.utils.parseEther(valueToFund.toString())})
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
  // --------------------------------------------------------- DB_NFT_CONTRACT INTERACTIONS -----------------------------------------------------------------------------------------------
  const getCurrentTokenId = async () => {
    return await DB_NFT.totalSupply()
  }

  // Now only contributors that at least one time submitted || only  the owner| NFT holder
  const hasAccess = async (address: string, tokenId: number) => {
    return await DB_NFT.hasAccess(address, tokenId)
  }

  const hasRepoAccess = async (address: string, tokenId: number) => {
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

    try {
      const tx = await DB_NFT.createPrivateRepo(
        repoName,
        description,
        SubmitProof,
        SubmitRoot,
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

  const updateRepoSubmitAccessControl = async (
    tokenId: number,
    SubmitProof: string[]
  ): Promise<any> => {
    const AccessSubmitleaves = SubmitProof.map((x) => ethers.utils.keccak256(x))
    const SubmitTree = new MerkleTree(
      AccessSubmitleaves,
      ethers.utils.keccak256,
      { sortPairs: true }
    )
    const SubmitRoot = SubmitTree.getHexRoot()
    try {
      const tx = await DB_NFT.setRepoSubmitAccessMerkleRoot(
        tokenId,
        SubmitProof,
        SubmitRoot,
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

  const createMultisig = async (
    owners: string[],
    minimumSignatures: number,
  ): Promise<any> => {
    try {
      const bytes = await Helper.getBytecodeTokenInfoPasser(owners,minimumSignatures)
      const tx = await multisigFactory.createAccount(
        owners[0],
        bytes,
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



  const multisigCreateBountyProposal = async (
    Multisigaddress: string,
    value:string,
    name: string,
    description: string,
    dataFormat:string,
  ): Promise<any> => {
    try {

    let iface = new ethers.utils.Interface(crossChainBacalhauJobsAbi);
    let data = iface.encodeFunctionData("createBounty", [name,description,dataFormat])

      const multisig = new ethers.Contract(
        Multisigaddress,
        MultisigAbi,
        signer!
      )
      const tx = await multisig.submitTransaction(crossChainBacalhauJobs_address,value,data)
      
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

  const multisigAssignBountyWinnerProposal = async (
    Multisigaddress: string,
    bountyID:number,
    name:string,
    description:string,
    dataFormat:string,
    startCommand:string,
    endCommand:string,
    numberOfInputs:number,
    winner:string
  ): Promise<any> => {
    try {

    let iface = new ethers.utils.Interface(crossChainBacalhauJobsAbi);
    let data = iface.encodeFunctionData("assignBountyResult", [bountyID,name,description,dataFormat,startCommand,endCommand,numberOfInputs,winner])

      const multisig = new ethers.Contract(
        Multisigaddress,
        MultisigAbi,
        signer!
      )
      const tx = await multisig.submitTransaction(crossChainBacalhauJobs_address,0,data)
      
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

  const multisigConfirmTransaction = async (
    Multisigaddress: string,
    transactionIndex: number,
  ): Promise<any> => {
    try {
      const multisig = new ethers.Contract(
        Multisigaddress,
        MultisigAbi,
        signer!
      )
      const tx = await multisig.confirmTransaction(transactionIndex)
      
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

  const multisigExecuteTransaction = async (
    Multisigaddress: string,
    transactionIndex: number,
  ): Promise<any> => {
    try {
      const multisig = new ethers.Contract(
        Multisigaddress,
        MultisigAbi,
        signer!
      )
      const tx = await multisig.executeTransaction(transactionIndex)
      
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

  const createJob = async (
    name:string,
    description: string,
    dataFormat: string,
    startCommand:string,
    endCommand:string,
    numberOfInputs:number,
    creator:string
  ): Promise<any> => {
    try {
      const tx = await tablelandBacalhau.createJOB(
        name,
        description,
        dataFormat,
        startCommand,
        endCommand,
        numberOfInputs,
        creator
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

  const bountyCreation = async (
    name:string,
    description: string,
    dataFormat: string,
    value:number
  ): Promise<any> => {
    try {
      const tx = await tablelandBacalhau.createBounty(
        name,
        description,
        dataFormat,
        {
          value: ethers.utils.parseEther(value.toString()),
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



  const assignBountyResult = async (
    bountyID:number,
    name:string,
    description:string,
    dataFormat:string,
    startCommand:string,
    endCommand:string,
    numberOfInputs:number,
    winner:string
  ): Promise<any> => {
    try {
      const tx = await tablelandBacalhau.assignBountyResult(
        bountyID,
        name,
        description,
        dataFormat,
        startCommand,
        endCommand,
        numberOfInputs,
        winner,
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


  const ExecutionFulfilled = async (
      requestID:number,
      result: string,
    ): Promise<any> => {
      try {
        const tx = await tablelandBacalhau.ExecutionFulfilled(
          requestID,
          result,
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

  const ExecutionStarted = async (
    requestID:number,
    bacalhauJobID: string,
    ): Promise<any> => {
      try {
      const tx = await tablelandBacalhau.ExecutionStarted(
        requestID,
        bacalhauJobID
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
  const ExecuteJob = async (
    jobID:number,
    input: string[],
    value: number
  ): Promise<any> => {
    try {
      const tx = await tablelandBacalhau.executeJOB(
        jobID,
        input,
        {
<<<<<<< HEAD
          value: ethers.utils.parseEther(value.toString())
=======
          value: ethers.utils.parseEther(value.toString()),
>>>>>>> ec4595af3ff49322ec706f9cc8b4a3e55690cd19
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
    ExecuteJob,
    assignBountyResult,
    bountyCreation,
    createJob,
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
    fundUserMumbai,
    fundEscrowMumbai,
    fundUserHyperspace,
    fundEscrowHyperspace,
    ExecutionStarted,
    ExecutionFulfilled,
    multisigExecuteTransaction,
    multisigConfirmTransaction,
    multisigAssignBountyWinnerProposal,
    multisigCreateBountyProposal,
    createMultisig

  }
}
