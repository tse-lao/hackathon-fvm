require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")


const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)


module.exports = async({ deployments }) => {
    const { deploy } = deployments;
    console.log("Wallet Ethereum Address:", wallet.address)
    const chainId = network.config.chainId

    //---------------------------------------------------------------HYPERSPACE DEPLOYMENT---------------------------------------------------------------------------------------

    // deploy DealTablelandStorage Helper
    const dealTablelandStorage = await deploy("dealTablelandStorage", {
        from: wallet.address,
        args: [],
        log: true,
    });

    // //deploy TablelandDealClient
    const tablelandDealClient = await deploy("tablelandDealClient", {
        from: wallet.address,
        args: [dealTablelandStorage.address],
        log: true,
    });

    // Create DealTablelandStorage Contract Instance to Interact With

    const DealTablelandStorage = await ethers.getContractFactory("dealTablelandStorage", wallet)

    const dealTablelandStorageInstance = await DealTablelandStorage.attach(dealTablelandStorage.address)

    // Make the tablelandDealClient Owner by calling transferOwnership that gives him the prestige to be the only one 
    // to manage the tableland tables for the Deals and the Requests

    await dealTablelandStorageInstance.transferOwnership(tablelandDealClient.address)


    // Create TablelandDealClient Contract Instance to Interact With and create a deal Proposal

    const TablelandDealClient = await ethers.getContractFactory("tablelandDealClient", wallet)

    const TablelandDealClientInstance = await TablelandDealClient.attach(tablelandDealClient.address)

    const locationRef = "https://data-depot.lighthouse.storage/api/download/download_car?fileId=bf1a735f-132c-4c3d-9ed1-b1fd58a5c84a.car"
    const carSize = 55214
    const skipIpniAnnounce = false
    const removeUnsealedCopy = false
    const extraParamsV1 = [
        locationRef,
        carSize,
        skipIpniAnnounce,
        removeUnsealedCopy
    ]
    const latestBlock = await hre.ethers.provider.getBlock("latest")
        // console.log(latestBlock)
    const cidHex = "0x000181e20392202082f53da28495b71ee6d7fe079ee25d9f2679db5563bc821bc0bedc915a9dc237"
    const pieceSize = 65536
    const verified = false
    const label = "bafybeielh4cafm7a7ku6l7qsztywovwznab5jnhehrxb2m7kvoydwhorjm"
    const startEpoch = latestBlock.number + 2700
    const endEpoch = 1050026
    const storagePricePerEpoch = 0
    const providerCollateral = 0
    const clientCollateral = 0
    const extraParamsVersion = 1
    const DealRequestStruct = [
        cidHex,
        pieceSize,
        verified,
        label,
        startEpoch,
        endEpoch,
        storagePricePerEpoch,
        providerCollateral,
        clientCollateral,
        extraParamsVersion,
        extraParamsV1
    ]

    // Create a Deal Proposal on Filecoin using the TablelandDealClient that will enter the Request record into tableland table owned byt the 
    // await TablelandDealClientInstance.makeDealProposal(DealRequestStruct, { gasLimit: 100000000 })

    let requestTableName = await dealTablelandStorageInstance.tables(0)
    let dealTableName = await dealTablelandStorageInstance.tables(1)

    let GetAllRequestsTablelandURL = 'https://testnets.tableland.network/api/v1/query?format=objects&extract=true&unwrap=true&statement=SELECT * FROM ' + requestTableName
    console.log("Check The Deal Requests made on this URL tableland endpoint   : ", GetAllRequestsTablelandURL)

    let GetAllAcceptedDealsTablelandURL = 'https://testnets.tableland.network/api/v1/query?format=objects&extract=true&unwrap=true&statement=SELECT * FROM ' + dealTableName
    console.log("\nCheck The accepted deals from Storage Providers on this URL tableland endpoint   : ", GetAllAcceptedDealsTablelandURL)


    // let result3 = await TablelandDealClientInstance.getDealRequest("0xc1a07ef36d36d4cd07801f9243dc472ce5e4dd9da36908b6023aeeaa03016acb")
    // console.log(result3)



    //deploy bacalhauTablelandStorage
    const bacalhauTablelandStorage = await deploy("bacalhauTablelandStorage", {
        from: wallet.address,
        args: [],
        log: true,
    });

    const BacalhauTablelandStorage = await ethers.getContractFactory("bacalhauTablelandStorage", wallet)

    const bacalhauTablelandStorageInstance = await BacalhauTablelandStorage.attach(bacalhauTablelandStorage.address)

    const lillyPadBridgeAddress = "0x489656E4eDDD9c88F5Fe863bDEd9Ed0Dc29B224c"
        // deploy crossChainTablelandBacalhauJobs
    const tablelandBacalhauJobs = await deploy("tablelandBacalhauJobs", {
        from: wallet.address,
        args: [lillyPadBridgeAddress, bacalhauTablelandStorage.address],
        log: true,
    });

    const TablelandBacalhauJobs = await ethers.getContractFactory("tablelandBacalhauJobs", wallet)

    const Tableland_BacalhauJobs = await TablelandBacalhauJobs.attach(tablelandBacalhauJobs.address)

    await bacalhauTablelandStorageInstance.transferOwnership(tablelandBacalhauJobs.address)

    // await Tableland_BacalhauJobs.executeJOB("specStart", "specStart", "specStart", "specStart")
    let execTable = await bacalhauTablelandStorageInstance.tables(0)
    let jobTable = await bacalhauTablelandStorageInstance.tables(1)

    console.log(execTable, "   ", jobTable)


    // -------------------------------------------------------------------------------- Tableland Deal Rewarder ------------------------------------------------------------------------------

    // deploy DealTablelandStorage Helper
    const rewardTablelandStorage = await deploy("rewardTablelandStorage", {
        from: wallet.address,
        args: [],
        log: true,
    });

    // //deploy TablelandDealClient
    const tablelandDealRewarder = await deploy("tablelandDealRewarder", {
        from: wallet.address,
        args: [rewardTablelandStorage.address],
        log: true,
    });

    // Create DealTablelandStorage Contract Instance to Interact With

    const RewardTablelandStorage = await ethers.getContractFactory("rewardTablelandStorage", wallet)

    const RewardTablelandStorageInstance = await RewardTablelandStorage.attach(rewardTablelandStorage.address)

    const TablelandDealRewarder = await ethers.getContractFactory("tablelandDealRewarder", wallet)

    const TablelandDealRewarderInstance = await TablelandDealRewarder.attach(tablelandDealRewarder.address)

    // Make the tablelandDealClient Owner by calling transferOwnership that gives him the prestige to be the only one 
    // to manage the tableland tables for the Deals and the Requests

    await RewardTablelandStorageInstance.transferOwnership(tablelandDealRewarder.address)

    let bountyTable = await RewardTablelandStorageInstance.tables(0)
    let claimTable = await RewardTablelandStorageInstance.tables(1)

    console.log(bountyTable, "   ", claimTable)

    // await TablelandDealRewarderInstance.createBounty(label,
    //     cidHex,
    //     location_ref,
    //     0,
    //     100,
    //     pieceSize)
}