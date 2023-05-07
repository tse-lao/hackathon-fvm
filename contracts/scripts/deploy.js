const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

async function main() {

    const DB_NFT = await ethers.getContractFactory("DB_NFT");
    console.log("Deploying DB_NFT...");
    const db_NFT = await DB_NFT.deploy(0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B, 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6);
    await db_NFT.deployed();
    console.log("db_NFT deployed to:", db_NFT.address);


    const CrossChainBacalhauJobs = await ethers.getContractFactory("crossChainBacalhauJobs");
    console.log("Deploying CrossChainBacalhauJobs...");
    const crossChainBacalhauJobs = await CrossChainBacalhauJobs.deploy(0x489656E4eDDD9c88F5Fe863bDEd9Ed0Dc29B224c, 0xe432150cce91c13a887f7D836923d5597adD8E31, 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6);
    await crossChainBacalhauJobs.deployed();
    console.log("crossChainBacalhauJobs deployed to:", crossChainBacalhauJobs.address);
}

main();