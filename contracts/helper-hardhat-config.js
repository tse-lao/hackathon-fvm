const { ethers } = require("hardhat")

const networkConfig = {
    31415926: {
        name: "localnet",
        tokensToBeMinted: 12000,
    },
    3141: {
        name: "hyperspace",
        tokensToBeMinted: 12000,
    },
    314: {
        name: "filecoinmainnet",
        tokensToBeMinted: 12000,
        // locationRef: "https://data-depot.lighthouse.storage/api/download/download_car?fileId:bf1a735f-132c-4c3d-9ed1-b1fd58a5c84a.car",
        // carSize: 55214,
        // skipIpniAnnounce: false,
        // removeUnsealedCopy: false,
        // extraParamsV1: [
        //     locationRef,
        //     carSize,
        //     skipIpniAnnounce,
        //     removeUnsealedCopy
        // ],
        // latestBlock: await hre.ethers.provider.getBlock("latest"),
        // // console.log(latestBlock)
        // cidHex: "0x000181e20392202082f53da28495b71ee6d7fe079ee25d9f2679db5563bc821bc0bedc915a9dc237",
        // pieceSize: 65536,
        // verified: false,
        // label: "bafybeielh4cafm7a7ku6l7qsztywovwznab5jnhehrxb2m7kvoydwhorjm",
        // startEpoch: latestBlock.number + 2700,
        // endEpoch: 1050026,
        // storagePricePerEpoch: 0,
        // providerCollateral: 0,
        // clientCollateral: 0,
        // extraParamsVersion: 1,
        // DealRequestStruct: [
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
    },
}

// const developmentChains : ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    // developmentChains,
}