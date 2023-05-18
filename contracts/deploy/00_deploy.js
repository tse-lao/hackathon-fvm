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

    //---------------------------------------------------------------MUMBAI DEPLOYMENT---------------------------------------------------------------------------------------

    // //deploy TablelandStorage
    // const TablelandStorage = await deploy("TablelandStorage", {
    //     from: wallet.address,
    //     args: ["0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B", "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"],
    //     log: true,
    // });

    // // //deploy DB_NFT
    // const DB_NFT = await deploy("DB_NFT", {
    //     from: wallet.address,
    //     args: [TablelandStorage.address],
    //     log: true,
    // });

    // const Tableland_Storage = await ethers.getContractFactory("TablelandStorage", wallet)

    // const tablelandStorage = await Tableland_Storage.attach(TablelandStorage.address)

    // // await tablelandStorage.transferOwnership(DB_NFT.address)

    // const dB_NFT = await ethers.getContractFactory("DB_NFT", wallet)

    // const db_NFT = await dB_NFT.attach(DB_NFT.address)

    // // await db_NFT.assignNewPKP("0xf129b0D559CFFc195a3C225cdBaDB44c26660B60")

    // const destinationChain1 = "filecoin"
    // const destinationAddress1 = "0x51A4F59C251c99880B9F02817a5378e45d299DE9"
    // const piece_cid1 = "0x000181e20392202082f53da28495b71ee6d7fe079ee25d9f2679db5563bc821bc0bedc915a9dc237"
    // const label1 = "bafybeielh4cafm7a7ku6l7qsztywovwznab5jnhehrxb2m7kvoydwhorjm"
    // const piece_size1 = 65536
    // const end_epoch1 = 1050026
    // const location_ref1 = "https://data-depot.lighthouse.storage/api/download/download_car?fileId=bf1a735f-132c-4c3d-9ed1-b1fd58a5c84a.car"
    // const car_size1 = 55214

    // await tablelandStorage.createCrossChainDealRequest(
    //     destinationChain1,
    //     destinationAddress1,
    //     piece_cid1,
    //     label1,
    //     piece_size1,
    //     end_epoch1,
    //     location_ref1,
    //     car_size1, {
    //         value: ethers.utils.parseEther("1.5"),
    //         gasLimit: 1000000
    //     }
    // )


    //---------------------------------------------------------------HYPERSPACE DEPLOYMENT---------------------------------------------------------------------------------------






    // // //deploy DealTablelandStorage
    // const DealTablelandStorage = await deploy("dealTablelandStorage", {
    //     from: wallet.address,
    //     args: [],
    //     log: true,
    // });

    // // //deploy TablelandDealClientV2
    // const CrossChainTablelandDealClient = await deploy("crossChainTablelandDealClient", {
    //     from: wallet.address,
    //     args: ["0xe432150cce91c13a887f7D836923d5597adD8E31", "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6", DealTablelandStorage.address],
    //     log: true,
    // });

    // const DealTableland_Storage = await ethers.getContractFactory("dealTablelandStorage", wallet)

    // const dealTablelandStorage = await DealTableland_Storage.attach(DealTablelandStorage.address)

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
    // const DealRequestStruct = [
    //     cidHex,
    //     pieceSize,
    //     verified,
    //     label,
    //     startEpoch,
    //     endEpoch,
    //     storagePricePerEpoch,
    //     providerCollateral,
    //     clientCollateral,
    //     extraParamsVersion,
    //     extraParamsV1
    // ]

    // await dealTablelandStorage.transferOwnership(CrossChainTablelandDealClient.address)

    // const crossChainTablelandDealClient = await ethers.getContractFactory("crossChainTablelandDealClient", wallet)

    // const crossChainTableland_DealClient = await crossChainTablelandDealClient.attach(CrossChainTablelandDealClient.address)

    // let result2 = await crossChainTableland_DealClient.makeDealProposal(DealRequestStruct, { gasLimit: 100000000 })

    // // let result3 = await tablelandDealClientV2.getDealRequest("0xc1a07ef36d36d4cd07801f9243dc472ce5e4dd9da36908b6023aeeaa03016acb")
    // // console.log(result3)


    // // //deploy crossChainTablelandBacalhauJobs
    const crossChainTablelandBacalhauJobs = await deploy("crossChainTablelandBacalhauJobs", {
        from: wallet.address,
        args: ["0x489656E4eDDD9c88F5Fe863bDEd9Ed0Dc29B224c", "0xe432150cce91c13a887f7D836923d5597adD8E31", "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"],
        log: true,
    });


    // // //deploy crossChainTablelandDealRewarder
    // const crossChainTablelandDealRewarder = await deploy("crossChainTablelandDealRewarder", {
    //     from: wallet.address,
    //     args: ["0xe432150cce91c13a887f7D836923d5597adD8E31", "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"],
    //     log: true,
    // });
}