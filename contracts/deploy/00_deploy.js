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

    const locationRef = "https://data-depot.lighthouse.storage/api/download/download_car?fileId=49d16aec-8a18-4c32-aa10-763a56f49b91.car"
    const carSize = 23070
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
    const cidHex = "0x000181e203922020a16870e5c705ae73fbad7307e76ba10f1bd252f1b3d0284cce05d163c6ca2e1c"
    const pieceSize = 32768
    const verified = false
    const label = "bafybeieaieampig3ugp3mz3iaepoduaju7hgzj5bxqweih7v325q7lm7zm"
    const startEpoch = latestBlock.number + 5500
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
    await TablelandDealClientInstance.makeDealProposal(DealRequestStruct, { gasLimit: 100000000 })

    let requestTableName = await dealTablelandStorageInstance.tables(0)
    let dealTableName = await dealTablelandStorageInstance.tables(1)

    let GetAllRequestsTablelandURL = 'https://testnets.tableland.network/api/v1/query?format=objects&extract=true&unwrap=true&statement=SELECT * FROM ' + requestTableName
    console.log("Check The Deal Requests made on this URL tableland endpoint   : ", GetAllRequestsTablelandURL)

    let GetAllAcceptedDealsTablelandURL = 'https://testnets.tableland.network/api/v1/query?format=objects&extract=true&unwrap=true&statement=SELECT * FROM ' + dealTableName
    console.log("\nCheck The accepted deals from Storage Providers on this URL tableland endpoint   : ", GetAllAcceptedDealsTablelandURL)


    // let result3 = await TablelandDealClientInstance.getDealRequest("0xc1a07ef36d36d4cd07801f9243dc472ce5e4dd9da36908b6023aeeaa03016acb")
    // console.log(result3)



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

    // await Tableland_BacalhauJobs.submitFunds({ value: ethers.utils.parseEther("1") })

    // await Tableland_BacalhauJobs.executeJOB("specStart", "specStart", "specStart", "specStart")
    // let execTable = await bacalhauTablelandStorageInstance.tables(0)

    // console.log(execTable, "   ")


    // // -------------------------------------------------------------------------------- Tableland Deal Rewarder ------------------------------------------------------------------------------

    // // deploy DealTablelandStorage Helper
    // const rewardTablelandStorage = await deploy("rewardTablelandStorage", {
    //     from: wallet.address,
    //     args: [],
    //     log: true,
    // });

    // // //deploy TablelandDealClient
    // const tablelandDealRewarder = await deploy("tablelandDealRewarder", {
    //     from: wallet.address,
    //     args: [rewardTablelandStorage.address],
    //     log: true,
    // });

    // // Create DealTablelandStorage Contract Instance to Interact With

    // const RewardTablelandStorage = await ethers.getContractFactory("rewardTablelandStorage", wallet)

    // const RewardTablelandStorageInstance = await RewardTablelandStorage.attach(rewardTablelandStorage.address)

    // const TablelandDealRewarder = await ethers.getContractFactory("tablelandDealRewarder", wallet)

    // const TablelandDealRewarderInstance = await TablelandDealRewarder.attach(tablelandDealRewarder.address)

    // // Make the tablelandDealClient Owner by calling transferOwnership that gives him the prestige to be the only one 
    // // to manage the tableland tables for the Deals and the Requests

    // await RewardTablelandStorageInstance.transferOwnership(tablelandDealRewarder.address)

    // let bountyTable = await RewardTablelandStorageInstance.tables(0)
    // let claimTable = await RewardTablelandStorageInstance.tables(1)

    // console.log(bountyTable, "   ", claimTable)

    // await TablelandDealRewarderInstance.createBounty(label,
    //     cidHex,
    //     locationRef,
    //     0,
    //     100,
    //     pieceSize, { gasLimit: 100000000 })






    //---------------------------------------------------------------MUMBAI DEPLOYMENT---------------------------------------------------------------------------------------

    // //deploy TablelandStorage
    // const TablelandStorage = await deploy("TablelandStorage", {
    //     from: wallet.address,
    //     args: [],
    //     log: true,
    // });

    // //deploy DB_NFT
    // const DB_NFT = await deploy("DB_NFT", {
    //     from: wallet.address,
    //     args: [TablelandStorage.address],
    //     log: true,
    // });

    // const tablelandStorage = await ethers.getContractFactory("TablelandStorage", wallet)

    // const tablelandStorageInstance = await tablelandStorage.attach(TablelandStorage.address)

    // await tablelandStorageInstance.transferOwnership(DB_NFT.address)

    // let contributionTable = await tablelandStorageInstance.tables(0)
    // let mainTable = await tablelandStorageInstance.tables(1)
    // let attributeTable = await tablelandStorageInstance.tables(2)
    // console.log(mainTable, "   ", attributeTable, "   ", contributionTable)


    // const db_NFT = await ethers.getContractFactory("DB_NFT", wallet)

    // const db_NFT_Instance = await db_NFT.attach(DB_NFT.address)

    // await db_NFT_Instance.assignNewSignerAddress("0xf129b0D559CFFc195a3C225cdBaDB44c26660B60")

    // // await db_NFT_Instance.RequestDB(
    // //     "dataFormatCID",
    // //     "dbName",
    // //     "description", ["test"],
    // //     1,
    // //     1
    // // )

    // // await db_NFT_Instance.createOpenDataSet(
    // //     "test",
    // //     "test",
    // //     "test",
    // //     "test",
    // //     "test", ["test"]
    // // )

    // // await db_NFT_Instance.updateDB_NFT1(1, "test2", "test3")


}