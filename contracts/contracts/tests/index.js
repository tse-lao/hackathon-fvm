import { expect } from "chai"
import { ethers } from "hardhat"


describe("Contract NAME", async function() {
    it("should return something or should not", async function() {
        const Contract = await ethers.getContractFactory("Contract_Name");
        const contract = await Contract.deploy("params");
        await contract.deployed();
    });


});