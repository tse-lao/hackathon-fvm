require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
    solidity: "0.8.17",
    settings: {
        optimizer: {
            enabled: true,
            runs: 10
        }
    },
    networks: {
        mumbai: {
            url: `https://polygon-mumbai.g.alchemy.com/v2/ZiPX0JtXnVqQ56RGdvdy8mvCOs4ZDchO`,
            accounts: ["304030045e69a283fbc39a3f1b7b281ede03afdefa6f480a682e8974bc20b547"],
        },
        hyperspace: {
            url: ``,
            accounts: ["304030045e69a283fbc39a3f1b7b281ede03afdefa6f480a682e8974bc20b547"],
        },
    },
    etherscan: {
        apiKey: "",
    },
}