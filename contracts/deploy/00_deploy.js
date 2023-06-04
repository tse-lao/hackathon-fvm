require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { Console } = require("console")


const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)


module.exports = async({ deployments }) => {
    const { deploy } = deployments;
    console.log("Wallet Ethereum Address:", wallet.address)
    const chainId = network.config.chainId


    //deploy bacalhauTablelandStorage
    const bacalhauTablelandStorage = await deploy("bacalhauTablelandStorage", {
        from: wallet.address,
        args: [],
        log: true,
    });

    const BacalhauTablelandStorage = await ethers.getContractFactory("bacalhauTablelandStorage", wallet)

    const bacalhauTablelandStorageInstance = await BacalhauTablelandStorage.attach(bacalhauTablelandStorage.address)

    // deploy TablelandBacalhauJobs
    const tablelandBacalhauJobs = await deploy("tablelandBacalhauJobs", {
        from: wallet.address,
        args: [bacalhauTablelandStorage.address],
        log: true,
    });

    const TablelandBacalhauJobs = await ethers.getContractFactory("tablelandBacalhauJobs", wallet)

    const Tableland_BacalhauJobs = await TablelandBacalhauJobs.attach(tablelandBacalhauJobs.address)

    await bacalhauTablelandStorageInstance.transferOwnership(tablelandBacalhauJobs.address)

    // await Tableland_BacalhauJobs.executeJOB("specStart", "specStart", "specStart", "specStart")
    let execTable = await bacalhauTablelandStorageInstance.tables(0)
    let jobTable = await bacalhauTablelandStorageInstance.tables(1)
    let bountyTable = await bacalhauTablelandStorageInstance.tables(2)


    console.log(execTable, "   ", jobTable, "    ", bountyTable)

    //---------------------------------------------------------------MUMBAI DEPLOYMENT---------------------------------------------------------------------------------------

    // const MultisigHelper = await hre.ethers.getContractFactory("MultisigHelper");

    // // const multisigHelper = await MultisigHelper.deploy()
    // // await multisigHelper.deployed()

    // // console.log("3 :", multisigHelper.address)
    // helperInstance = MultisigHelper.attach("0xC7567A0af88054E51E842252078A58Bed1A97fEe")
    // let bytes = await helperInstance.getBytecodeTokenInfoPasser(["0x044B595C9b94A17Adc489bD29696af40ccb3E4d2", "0x464e3F471628E162FA34F130F4C3bCC41fF7635d"], 1)
    // console.log(bytes)

    // const MultisigFactory = await hre.ethers.getContractFactory("multisigFactory");

    // const multisigFactory = await MultisigFactory.deploy("0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789")
    // await multisigFactory.deployed()
    // console.log("1 :", multisigFactory.address)

    // const FactoryInstance = await MultisigFactory.attach("0x8933aFb68AF165D217A4AEB6d3a91FA7656e4B3B")
    //     // const FactoryInstance = await MultisigFactory.attach(multisigFactory.address)


    // // let tx = await FactoryInstance.createAccount("0x044B595C9b94A17Adc489bD29696af40ccb3E4d2", bytes, { gasLimit: 10000000 })
    // // let receipt = await tx.wait()
    // // console.log(receipt)

    // const MultisigAccountV2 = await hre.ethers.getContractFactory("multisigAccountV2");
    // const multisigAccountV2 = await MultisigAccountV2.deploy("0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", multisigFactory.address)
    // await multisigAccountV2.deployed()

    // console.log("2 :", multisigAccountV2.address)


    // const multisigAccountInstance = await MultisigAccountV2.attach("0x61405dfcE59758c6f2700Ce8e6Bc7A4974D449E1")



    let flatSig = await multisigAccountInstance.getMessageHash("message");
    let msg = ethers.utils.solidityPack(["address", "uint256", "bytes", "string"], ["0x044B595C9b94A17Adc489bD29696af40ccb3E4d2", ethers.BigNumber.from("1"), "0x00", "nikos"])
    console.log(msg)

    let flatSig = await wallet.signMessage(ethers.utils.arrayify(ethers.utils.id("nikos")));

    // // // print the raw transaction hash
    // console.log('Raw txhash string ' + flatSig);


    // let ABI = [
    //     "function transfer(address to, uint amount)"
    // ];
    // let iface = new ethers.utils.Interface(ABI);
    // iface.encodeFunctionData("transfer", ["0x1234567890123456789012345678901234567890", parseEther("1.0")])


}

// //deploy TablelandStorage
// const TablelandStorage = await deploy("TablelandStorage", {
//     from: wallet.address,
//     args: ["https://testnets.tableland.network/api/v1/query?format=objects&extract=true&unwrap=true&statement=", "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B", "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"],
//     log: true,
// });



// const tablelandStorage = await ethers.getContractFactory("TablelandStorage", wallet)
// console.log("TablelandStorage address:  ", TablelandStorage.address);



// const tablelandStorageInstance = await tablelandStorage.attach(TablelandStorage.address)


// const locationRef = "https://data-depot.lighthouse.storage/api/download/download_car?fileId=bf1a735f-132c-4c3d-9ed1-b1fd58a5c84a.car"
// const carSize = 55214
// const skipIpniAnnounce = false
// const removeUnsealedCopy = false
// const extraParamsV1 = [
//     locationRef,
//     carSize,
//     skipIpniAnnounce,
//     removeUnsealedCopy
// ]
// const latestBlock = await hre.ethers.provider.getBlock("latest")
//     // console.log(latestBlock)
// const cidHex = "0x000181e20392202082f53da28495b71ee6d7fe079ee25d9f2679db5563bc821bc0bedc915a9dc237"
// const pieceSize = 65536
// const verified = false
// const label = "bafybeielh4cafm7a7ku6l7qsztywovwznab5jnhehrxb2m7kvoydwhorjm"
// const startEpoch = latestBlock.number + 2700
// const endEpoch = 1050026
// const storagePricePerEpoch = 0
// const providerCollateral = 0
// const clientCollateral = 0
// const extraParamsVersion = 1

// await tablelandStorageInstance.crossChainTokenInit(
//     1,
//     cidHex,
//     label,
//     pieceSize,
//     locationRef,
//     carSize,
//     0,
//     tokenInfoPasserAddress, {
//         value: ethers.utils.parseEther("1")
//     })
// await tablelandStorageInstance.createCrossChainDealRequest(
//         1,
//         dealClientAddress, {
//             value: ethers.utils.parseEther("1")
//         })
//---------------------------------------------------------------HYPERSPACE DEPLOYMENT---------------------------------------------------------------------------------------





// const tx1 = await create2Deployer.deploy(0, salt, TablelandDealClientFactory.bytecode, { gasLimit: 10000000000 });
// await tx1.wait();

// const bytecodehash = hre.ethers.utils.keccak256(TablelandDealClientFactory.bytecode);
// const address = await create2Deployer.computeAddress(salt, bytecodehash);

// console.log("address", tablelandDealClientFactory.address);

// const TablelandDealClientFactoryInstance = await TablelandDealClientFactory.attach(tablelandDealClientFactory.address)

// Make the tablelandDealClient Owner by calling transferOwnership that gives him the prestige to be the only one 
// to manage the tableland tables for the Deals and the Requests

// await dealTablelandStorageInstance.transferOwnership(tablelandDealClient.address)


// // Create TablelandDealClient Contract Instance to Interact With and create a deal Proposal

// const TablelandDealClient = await ethers.getContractFactory("tablelandDealClient", wallet)

// const TablelandDealClientInstance = await TablelandDealClient.attach(tablelandDealClient.address)



// Create a Deal Proposal on Filecoin using the TablelandDealClient that will enter the Request record into tableland table owned byt the 
// await TablelandDealClientInstance.makeDealProposal(DealRequestStruct, { gasLimit: 100000000 })

// let requestTableName = await dealTablelandStorageInstance.tables(0)
// let dealTableName = await dealTablelandStorageInstance.tables(1)

// let GetAllRequestsTablelandURL = 'https://testnets.tableland.network/api/v1/query?format=objects&extract=true&unwrap=true&statement=SELECT * FROM ' + requestTableName
// console.log("Check The Deal Requests made on this URL tableland endpoint   : ", GetAllRequestsTablelandURL)

// let GetAllAcceptedDealsTablelandURL = 'https://testnets.tableland.network/api/v1/query?format=objects&extract=true&unwrap=true&statement=SELECT * FROM ' + dealTableName
// console.log("\nCheck The accepted deals from Storage Providers on this URL tableland endpoint   : ", GetAllAcceptedDealsTablelandURL)


// // let result3 = await TablelandDealClientInstance.getDealRequest("0xc1a07ef36d36d4cd07801f9243dc472ce5e4dd9da36908b6023aeeaa03016acb")
// // console.log(result3)



// //deploy bacalhauTablelandStorage
// const bacalhauTablelandStorage = await deploy("bacalhauTablelandStorage", {
//     from: wallet.address,
//     args: [],
//     log: true,
// });

// const BacalhauTablelandStorage = await ethers.getContractFactory("bacalhauTablelandStorage", wallet)

// const bacalhauTablelandStorageInstance = await BacalhauTablelandStorage.attach(bacalhauTablelandStorage.address)

// const lillyPadBridgeAddress = "0x489656E4eDDD9c88F5Fe863bDEd9Ed0Dc29B224c"
//     // deploy crossChainTablelandBacalhauJobs
// const tablelandBacalhauJobs = await deploy("tablelandBacalhauJobs", {
//     from: wallet.address,
//     args: [lillyPadBridgeAddress, bacalhauTablelandStorage.address],
//     log: true,
// });

// const TablelandBacalhauJobs = await ethers.getContractFactory("tablelandBacalhauJobs", wallet)

// const Tableland_BacalhauJobs = await TablelandBacalhauJobs.attach(tablelandBacalhauJobs.address)

// await bacalhauTablelandStorageInstance.transferOwnership(tablelandBacalhauJobs.address)

// // await Tableland_BacalhauJobs.executeJOB("specStart", "specStart", "specStart", "specStart")
// let execTable = await bacalhauTablelandStorageInstance.tables(0)
// let jobTable = await bacalhauTablelandStorageInstance.tables(1)

// console.log(execTable, "   ", jobTable)


// -------------------------------------------------------------------------------- Tableland Deal Rewarder ------------------------------------------------------------------------------