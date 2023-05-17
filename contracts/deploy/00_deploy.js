require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { networkConfig } = require("../helper-hardhat-config")


const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async({ deployments }) => {
    const { deploy } = deployments;
    console.log("Wallet Ethereum Address:", wallet.address)
    const chainId = network.config.chainId
        // const tokensToBeMinted = networkConfig[chainId]["tokensToBeMinted"]


    // //deploy Simplecoin
    const TablelandStorage = await deploy("TablelandStorage", {
        from: wallet.address,
        args: ["0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B", "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"],
        log: true,
    });

    // //deploy FilecoinMarketConsumer
    const DB_NFT_V3 = await deploy("DB_NFT_V3", {
        from: wallet.address,
        args: [TablelandStorage.address],
        log: true,
    });

    // const TablelandStorage = await ethers.getContractFactory("TablelandStorage");
    // console.log("Deploying TablelandStorage...");
    // const tablelandStorage = await TableView.deploy("0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B", "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6");
    // await tablelandStorage.deployed();
    // console.log("tablelandView deployed to:", tablelandStorage.address);

    // const DB_NFT_V3 = await ethers.getContractFactory("DB_NFT_V3");
    // console.log("Deploying DB_NFT...");
    // const db_NFT = await DB_NFT_V3.deploy(tablelandView.address);
    // await db_NFT.deployed();
    // console.log("db_NFT deployed to:", db_NFT.address);

    // console.log(TablelandStorage.address, "   ", DB_NFT_V3.address)

    // //deploy DealRewarder
    // const dealRewarder = await deploy("DealRewarder", {
    //     from: wallet.address,
    //     args: [],
    //     log: true,
    // });

    //deploy DealClient
    // const dealClient = await deploy("DealClient", {
    //     from: wallet.address,
    //     args: [],
    //     log: true,
    // });
}