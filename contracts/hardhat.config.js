require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("./tasks")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
    /** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
                details: { yul: false },
            },
        },
    },
<<<<<<< HEAD
    defaultNetwork: "mumbai",
    // defaultNetwork: "hyperspace",
=======
    defaultNetwork: "Calibration",
    // defaultNetwork: "mumbai",
>>>>>>> hackfs

    networks: {
        Calibration: {
            chainId: 314159,
            url: "https://api.calibration.node.glif.io/rpc/v1",
            accounts: [PRIVATE_KEY],
        },
        FilecoinMainnet: {
            chainId: 314,
            url: "https://api.node.glif.io",
            accounts: [PRIVATE_KEY],
        },
        mumbai: {
            chainId: 80001,
            url: `
            https: //polygon-mumbai.g.alchemy.com/v2/ZiPX0JtXnVqQ56RGdvdy8mvCOs4ZDchO`,
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: "XAP64G9KV63W7FDW6V7IXGF4E1KMD7E2KK",
        customChains: [],
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
}