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
    defaultNetwork: "mumbai",
    // defaultNetwork: "hyperspace",

    networks: {
        localnet: {
            chainId: 31415926,
            url: "http://127.0.0.1:1234/rpc/v1",
            accounts: [PRIVATE_KEY],
        },
        hyperspace: {
            chainId: 3141,
            url: "https://api.hyperspace.node.glif.io/rpc/v1",
            accounts: [PRIVATE_KEY],
        },
        sepolia: {
            chainId: 11155111,
            url: "https://rpc.sepolia.org",
            accounts: [PRIVATE_KEY],
        },
        mumbai: {
            chainId: 80001,
            url: `https://polygon-mumbai.g.alchemy.com/v2/ZiPX0JtXnVqQ56RGdvdy8mvCOs4ZDchO`,
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