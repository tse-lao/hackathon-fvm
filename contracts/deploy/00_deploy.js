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

    const TablelandDealClientFactory = await hre.ethers.getContractFactory("tablelandDealClientFactory");


    // const tablelandDealClientFactory = await TablelandDealClientFactory.deploy()
    // await tablelandDealClientFactory.deployed()
    // console.log("1 :", tablelandDealClientFactory.address)


    const DealTablelandStorage = await hre.ethers.getContractFactory(
        "dealTablelandStorage"
    );
    const dealTablelandStorage = await DealTablelandStorage.deploy("0xb9d3cAC1C253B2033a817bBF9ECe915b7e018c3E")
    await dealTablelandStorage.deployed()
    console.log("dealTablelandStorage Address : ", dealTablelandStorage.address)

    const _dealTablelandStorage = await DealTablelandStorage.attach(
        dealTablelandStorage.address
    );
    let table1 = await _dealTablelandStorage.tables(0)
    let table2 = await _dealTablelandStorage.tables(1)
    let table3 = await _dealTablelandStorage.tables(2)
    console.log(table1, " ", table2, " ", table3)

    const tablelandDealClientFactoryInstance = await TablelandDealClientFactory.attach("0xb9d3cAC1C253B2033a817bBF9ECe915b7e018c3E")

    let txxx = await tablelandDealClientFactoryInstance.setDealTablelandStorage(dealTablelandStorage.address, { gasLimit: 10000000000 })
    await txxx.wait()
    console.log("tablelandStorage address is set")


    const txx = await tablelandDealClientFactoryInstance.createDataDAO(["0x464e3F471628E162FA34F130F4C3bCC41fF7635d", "0x044B595C9b94A17Adc489bD29696af40ccb3E4d2"], "0x044B595C9b94A17Adc489bD29696af40ccb3E4d2", [
        100, 136, 74, 176, 132, 26, 151, 143,
        14, 183, 219, 236, 162, 206, 234, 180,
        28, 8, 112, 223, 101, 150, 197, 48,
        228, 44, 128, 46, 9, 175, 70, 199
    ], { gasLimit: 10000000000 })
    await txx.wait()


    // const TablelandDealClient = await hre.ethers.getContractFactory("tablelandDealClient");
    // const tablelandDealClientInstance = await TablelandDealClient.attach("0x0a490cbc73689a26b303834d17c713d2580e5e41")


    const locationRef = "https://data-depot.lighthouse.storage/api/download/download_car?fileId=acc27545-13e0-4a72-8265-b8890738ee7f.car"
    const carSize = 11352672
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
    const cidHex = "0x0181e2039220202dece0ce08f4ac10e6526797bcdd0514b20e4e916ecee6ef56e409382c257509"
    const pieceSize = 16777216
    const verified = false
    const label = "bafybeiaen3wpllndct3iwpqzl74okl3wwx7eumwgktosooyjteuc3kxc44"
    const startEpoch = latestBlock.number + 39000
    const endEpoch = 2031760
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

    // let t = await tablelandDealClientInstance.addDataCapToFile("0x0181e2039220202dece0ce08f4ac10e6526797bcdd0514b20e4e916ecee6ef56e409382c257509", 16777216, { gasLimit: 10000000000 })
    // await t.wait()

    // t = await tablelandDealClientInstance.makeDealProposal(DealRequestStruct, { gasLimit: 10000000000 })
    // await t.wait()

    // t = await tablelandDealClientInstance.fileDataCap("0x0181e2039220202dece0ce08f4ac10e6526797bcdd0514b20e4e916ecee6ef56e409382c257509")

    // console.log(t)

    // t = await tablelandDealClientInstance.getDealRequest("0xbc97feb803096717066f710fbe615c50a8e8f7228d5ae1b4cccc60b7d1b23e6b")

    // console.log(t)




    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    // const Create2Deployer = await hre.ethers.getContractFactory(
    //     "Create2Deployer"
    // );
    // const create2Deployer_ = await Create2Deployer.deploy()
    // await create2Deployer_.deployed()
    // const create2Deployer = await Create2Deployer.attach(
    //     create2Deployer_.address
    // );

    // const WalletFactory = await hre.ethers.getContractFactory("multisigFactory");
    // const salt =
    //     "0x0001000000000000000000000000000000000010000000000000000001011010";
    // console.log("salt", salt);

    // const tx = await create2Deployer.deploy(0, salt, WalletFactory.bytecode);
    // await tx.wait();
    // const bytecodehash = hre.ethers.utils.keccak256(WalletFactory.bytecode);
    // const addresss = await create2Deployer.computeAddress(salt, bytecodehash);
    // console.log("address", addresss);

    // // await multisigHelper.deployed()

    // // console.log("3 :", multisigHelper.address)


    // let randomSalt = await ethers.utils.randomBytes(32)
    // console.log(randomSalt)

    // const MultisigFactory = await hre.ethers.getContractFactory(
    //     "multisigFactory"
    // );
    // // const multisigFactory = await deploy("multisigFactory", {
    // //     from: wallet.address,
    // //     args: [],
    // //     log: true,
    // // });

    // const _multisigFactory = await MultisigFactory.attach(
    //     addresss
    // );


    // let bytes = await _multisigFactory.getMultisigInitBytes("A multisig created on the dataBridge", "a sick working multisig with name and description", ["0x044B595C9b94A17Adc489bD29696af40ccb3E4d2", "0x464e3F471628E162FA34F130F4C3bCC41fF7635d"], addresss, 1)
    // console.log(bytes)

    // let txx = await _multisigFactory.createWallet(bytes, [
    //     100, 136, 74, 176, 132, 26, 151, 143,
    //     14, 183, 219, 236, 162, 206, 234, 180,
    //     28, 8, 112, 223, 101, 150, 197, 48,
    //     228, 44, 128, 46, 9, 175, 70, 199
    // ]);
    // await txx.wait();

    // let address = await _multisigFactory.getMultisigAddress(0)
    // console.log(address)

    // txx = await _create2Deployer.multisigs(0);
    // console.log(txx)

    // const Multisig = await hre.ethers.getContractFactory("Multisig");
    // const salt =
    //     "0x0001000000000000000000000000000000100010000000000000001001011010";
    // console.log("salt", salt);

    // console.log(MultisigFactory.bytecode)

    // const tx = await _create2Deployer.deploy(0, salt, ethers.utils.arrayify(init), { gasLimit: 10000000 });
    // await tx.wait();
    // const bytecodehash = hre.ethers.utils.keccak256(Multisig.bytecode);
    // const address = await _create2Deployer.computeAddress(salt, bytecodehash);
    // console.log("address", address);


    //deploy bacalhauTablelandStorage
    // const bacalhauTablelandStorage = await deploy("bacalhauTablelandStorage", {
    //     from: wallet.address,
    //     args: [],
    //     log: true,
    // });

    // const BacalhauTablelandStorage = await ethers.getContractFactory("bacalhauTablelandStorage", wallet)

    // const bacalhauTablelandStorageInstance = await BacalhauTablelandStorage.attach(bacalhauTablelandStorage.address)

    // // deploy TablelandBacalhauJobs
    // const tablelandBacalhauJobs = await deploy("tablelandBacalhauJobs", {
    //     from: wallet.address,
    //     args: [bacalhauTablelandStorage.address],
    //     log: true,
    // });

    // const TablelandBacalhauJobs = await ethers.getContractFactory("tablelandBacalhauJobs", wallet)

    // const Tableland_BacalhauJobs = await TablelandBacalhauJobs.attach(tablelandBacalhauJobs.address)

    // await bacalhauTablelandStorageInstance.transferOwnership(tablelandBacalhauJobs.address)

    // // await Tableland_BacalhauJobs.executeJOB("specStart", "specStart", "specStart", "specStart")
    // let execTable = await bacalhauTablelandStorageInstance.tables(0)
    // let jobTable = await bacalhauTablelandStorageInstance.tables(1)
    // let bountyTable = await bacalhauTablelandStorageInstance.tables(2)


    // console.log(execTable, "   ", jobTable, "    ", bountyTable)

    //---------------------------------------------------------------MUMBAI DEPLOYMENT---------------------------------------------------------------------------------------


    // const MultisigFactory = await hre.ethers.getContractFactory("multisigFactory");

    // const multisigFactory = await MultisigFactory.deploy("0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", { gasLimit: 10000000 })
    // await multisigFactory.deployed()
    // console.log("1 :", multisigFactory.address)

    // const FactoryInstance = await MultisigFactory.attach("0x376cA2cCC684Cb0a98a37c949cb888132EdDe90F")
    // const FactoryInstance = await MultisigFactory.attach(multisigFactory.address)


    // let tx = await FactoryInstance.createAccount("0x044B595C9b94A17Adc489bD29696af40ccb3E4d2", bytes, { gasLimit: 10000000 })
    // let receipt = await tx.wait()
    // console.log(receipt)

    // const Multisig = await hre.ethers.getContractFactory("Multisig");
    // const multisig = await Multisig.deploy("0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", multisigFactory.address, { gasLimit: 10000000 })
    // await multisig.deployed()

    // console.log("2 :", multisig.address)


    // const multisigAccountInstance = await Multisig.attach("0x76e66e82d8cb346423f6cd7f339d9be2332a4cc1")

    // let flatSig = await wallet.signMessage(ethers.utils.arrayify(ethers.utils.id("nikos2")));
    // // let flatSig = await wallet.signMessage(ethers.utils.id("nikos"));

    // let signatures = [flatSig]
    // let ABI = [
    //     "function createBounty(string, string, string) payable"
    // ];
    // let iface = new ethers.utils.Interface(ABI);
    // let data = iface.encodeFunctionData("createBounty", ["testBounty", "test", "test"])
    // console.log(data, "  ", tablelandBacalhauJobs.address, "   ", flatSig)

    // // let tx = await multisigAccountInstance.execute(tablelandBacalhauJobs.address, 0, data, "nikos", signatures)

    // // await tx.wait()

    // // let flatSig = await multisigAccountInstance.getMessageHash("message");
    // let msg = ethers.utils.solidityPack(["address", "uint256", "bytes", "string"], ["0x044B595C9b94A17Adc489bD29696af40ccb3E4d2", ethers.BigNumber.from("1"), "0x00", "nikos"])
    // console.log(msg)



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