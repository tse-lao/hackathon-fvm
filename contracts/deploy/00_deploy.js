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

    //deploy TablelandStorage
    const TablelandStorage = await deploy("TablelandStorage", {
        from: wallet.address,
        args: [],
        log: true,
    });

    //deploy DB_NFT
    const DB_NFT = await deploy("DB_NFT", {
        from: wallet.address,
        args: [TablelandStorage.address],
        log: true,
    });

    const tablelandStorage = await ethers.getContractFactory("TablelandStorage", wallet)

    const tablelandStorageInstance = await tablelandStorage.attach(TablelandStorage.address)

    await tablelandStorageInstance.transferOwnership(DB_NFT.address)

    let contributionTable = await tablelandStorageInstance.tables(0)
    let mainTable = await tablelandStorageInstance.tables(1)
    let attributeTable = await tablelandStorageInstance.tables(2)
    let EntryTable = await tablelandStorageInstance.tables(3)
    console.log(mainTable, "   ", attributeTable, "   ", contributionTable, "   ", EntryTable)


    const db_NFT = await ethers.getContractFactory("DB_NFT", wallet)

    const db_NFT_Instance = await db_NFT.attach(DB_NFT.address)

    await db_NFT_Instance.assignNewSignerAddress("0xf129b0D559CFFc195a3C225cdBaDB44c26660B60")

    await db_NFT_Instance.RequestDB(
        "dataFormatCID",
        "dbName",
        "description", ["test"],
        1,
        1
    )

    await db_NFT_Instance.createOpenDataSet(
        "test",
        "test",
        "test",
        "test",
        "test", ["test"]
    )

    await db_NFT_Instance.updateDB_NFT1(1, "test2", ["fdsfsdf", "fdsfdsfsdfdfsdf", "sdfsdfsdfdsfsdfsdfdsfdsf", "dsfsfsdfsdfsdfsdf"],
        "test3")

}