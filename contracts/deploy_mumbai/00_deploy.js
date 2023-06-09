require("hardhat-deploy")
require("hardhat-deploy-ethers")
const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

const { ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { keccak256 } = ethers.utils

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
        args: ["https://testnets.tableland.network/api/v1/query?format=objects&extract=true&unwrap=true&statement="],
        log: true,
    });

    //deploy DB_NFT
    const DB_NFT = await deploy("DB_NFT", {
        from: wallet.address,
        args: [TablelandStorage.address, "0xf129b0D559CFFc195a3C225cdBaDB44c26660B60"],
        log: true,
    });

    const tablelandStorage = await ethers.getContractFactory("TablelandStorage", wallet)

    const tablelandStorageInstance = await tablelandStorage.attach(TablelandStorage.address)

    await tablelandStorageInstance.transferOwnership(DB_NFT.address)

    let contributionTable = await tablelandStorageInstance.tables(0)
    let mainTable = await tablelandStorageInstance.tables(1)
    let attributeTable = await tablelandStorageInstance.tables(2)
    let proofs = await tablelandStorageInstance.tables(3)

    console.log(mainTable, "   ", attributeTable, "   ", contributionTable, "     ", proofs)


    const db_NFT = await ethers.getContractFactory("DB_NFT", wallet)

    const db_NFT_Instance = await db_NFT.attach(DB_NFT.address)


    const SubmitProof = ["0x044B595C9b94A17Adc489bD29696af40ccb3E4d2", "0x464e3F471628E162FA34F130F4C3bCC41fF7635d"]


    const AccessSubmitleaves = SubmitProof.map(x => keccak256(x))
    const SubmitTree = new MerkleTree(AccessSubmitleaves, keccak256, { sortPairs: true })
    const SubmitRoot = SubmitTree.getHexRoot()
    const hexProof = SubmitTree.getHexProof(AccessSubmitleaves[0])

    let ts = await db_NFT_Instance.totalSupply()
    console.log(ts)

    const tx = await db_NFT_Instance.createPrivateRepo(
        "Repo",
        "Repo",
        SubmitProof,
        SubmitRoot, { gasLimit: 1000000 })
    await tx.wait()

    console.log(1)

    const tx2 = await db_NFT_Instance.contribute(1, "dataCID", 0, hexProof, { gasLimit: 1000000 })
    await tx2.wait()

    console.log(2)




    const txReq = await db_NFT_Instance.RequestDB(
        "dataFormatCID",
        "dbName",
        "description", ["test"],
        1,
        1
    )
    await txReq.wait()
    console.log("RequestDB NFT")


    const tx3 = await db_NFT_Instance.contribute(2, "dataCID", 1, [], { gasLimit: 1000000 })
    await tx3.wait()
    console.log("cONTRIBUTED ON DB_NFT NFT")

    const tx4 = await db_NFT_Instance.createDBNFT(
        2,
        "fdfdf",
        0,
        "0x044B595C9b94A17Adc489bD29696af40ccb3E4d2",
        "fdfdfddf")
    await tx4.wait()
    console.log("CreatedDB NFT")

    const tx5 = await db_NFT_Instance.mintDB(2, { value: 0 })
    await tx5.wait()
    console.log("mintedddddd")
    const txx = await db_NFT_Instance.createOpenDataSet(
        "test",
        "test",
        "test",
        "test",
        "test", ["test"], { gasLimit: 1000000 })
    await txx.wait()

    await db_NFT_Instance.updateDB_NFT1(1, "test2", ["fdsfsdf", "fdsfdsfsdfdfsdf", "sdfsdfsdfdsfsdfsdfdsfdsf", "dsfsfsdfsdfsdfsdf"],
        "test3")

}