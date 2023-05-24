<h1>
 Welcome to DataBridge 💾🌉
</h1>

<p>
<img src="public\logo (1).webp" alt="alt text" width="40%"/>
</p>

## FVM Dataverse Hackathon 2023 Submission 🚀🧑‍🚀. 

[Demo video](https://www.youtube.com/watch?v=1scDw7K2KPU)
[dapp link](https://hackathon-fvm-fj45.vercel.app/)


Authors
 * [nijoe1](https://github.com/nijoe1)
 * [tse-lao](https://github.com/tse-lao)

## Description
DataBridge empowers decentralized data management. Collaborate to create valuable datasets, conduct verifiable computations, and seamlessly store on Filecoin. Experience the future of data curation
## Inspiration
Our inspiration for the DataBridge platform came from the need to revolutionize data management, collaboration, user empowerment, and low-cost permanent files in a decentralized manner. We recognized the growing demand for a secure and efficient solution to curate, collaborate, and create decentralized valuable datasets. Additionally, we saw the opportunity to bridge the gap between centralized data pools and the decentralized Filecoin network, allowing users to seamlessly onboard valuable data onto a secure and transparent platform.
## What it does?

 DataBridge is a decentralized application (DApp) designed to fulfill these needs it functions as a database aggregator. DataBridge empowers users to create decentralized databases (DBs) and request contributions from others. Once a DB reaches a predetermined threshold, the requestor can create a DB NFT. To ensure fair distribution of token minting revenues to DB contributors, our platform utilizes a splitter contract created using the thirdWeb splitter contract factory. 
 
 With DataBridge, users can leverage verifiable computations over data through the Lillypad oracle and facilitate deal-making using Filecoin proposed contracts. Onboard open datasets into IPFS and Filecoin through the DataBridge platform while maintaining your own private repository of encrypted files. Additionally, create sharable private repositories with secure access control, where only whitelisted addresses have the privilege to add files and access encrypted contents. To enhance security and efficiency, DataBridge incorporates Merkle trees for access control.

# 👨‍💻Technologies Used 🤖

## Lighthouse
Lighthouse plays a pivotal role in DataBridge as a robust encryption and decryption tool. It empowers users by providing a secure environment to encrypt and decrypt files using Lighthouse JWT tokens. With Lighthouse, users can onboard easily files and DBs into the platform. The backend utilizes Lighthouse to encrypt the file contents with sharing and custom access control teqniques and securely uploads the encrypted version to IPFS. DataBridge leverages Lighthouse's data depot service in the backend to retrieve all necessary file information for creating deals on Filecoin using the dealClient or dealRewarder contracts. Lighthouse ensures data confidentiality and integrity, enabling seamless file onboarding and secure storage within DataBridge.

- [useLighthouse](https://github.com/tse-lao/hackathon-fvm/blob/master/src/hooks/useLighthouse.js)
- [Lighthouse user on-boarding](https://github.com/tse-lao/hackathon-fvm/blob/master/src/pages/profile/onboarding/index.js)
## Tableland
Tableland is the backbone of DataBridge, serving as the primary decentralized database and enabling efficient data management and access control. It seamlessly connects files, DB filecoin deals, computations, and private repositories through cross-chain table queries. With Tableland, we establish a decentralized Merkle tree-based access control mechanism, by adding the storing into the tables the allowlisted addresses. This integration streamlines access control management, providing a secure and reliable environment for storing and managing DB files, deals, computations, and private repos.

 - [useTableland](https://github.com/tse-lao/hackathon-fvm/blob/master/src/hooks/useTableland.js)
 - [Tableland api](https://github.com/tse-lao/hackathon-fvm/tree/master/src/pages/api/tableland)

####Tables:

- [db nft main table](https://testnets.tableland.network/api/v1/query?statement=SELECT%20*%20FROM%20main_table_80001_6375)
- [db nft attributes table](https://testnets.tableland.network/api/v1/query?statement=SELECT%20*%20FROM%20attribute_table_80001_6376)
- [db nfts contributoins table](https://testnets.tableland.network/api/v1/query?statement=SELECT%20*%20FROM%20contribution_table_80001_6374)
- [merkle tree helper table](https://testnets.tableland.network/api/v1/query?statement=SELECT%20*%20FROM%20merkleHelper_table_80001_6377)
- [Bacalhau jobs table](https://testnets.tableland.network/api/v1/query?statement=SELECT%20*%20FROM%20computation_3141_122)
- [deal client deal requests](https://testnets.tableland.network/api/v1/query?statement=SELECT%20*%20FROM%20request_3141_93)
- [deal client deals table](https://testnets.tableland.network/api/v1/query?statement=SELECT%20*%20FROM%20deal_3141_94)
- [bounties table](https://testnets.tableland.network/api/v1/query?statement=SELECT%20*%20FROM%20bounty_3141_165)
- [Bounty claims table](https://testnets.tableland.network/api/v1/query?statement=SELECT%20*%20FROM%20claim_3141_166)

# Polybase
DataBridge utilizes Polybase to store and manage file metadata, allowing users to view and replicate their files within their profiles. This integration ensures that users can easily access and manage their valuable data. By leveraging Polybase, DataBridge creates a user-friendly environment, promoting efficient data exploration and collaboration among users. We also plan to add likes and comments to each database and other features that will help the end users.

- [usePolybase](https://github.com/tse-lao/hackathon-fvm/blob/master/src/hooks/usePolybase.js)
- [polybase api](https://github.com/tse-lao/hackathon-fvm/tree/master/src/pages/api/polybase)

# Smart Contracts


CONTRACT CODE  | EXPLORER
------------- | -------------
[DB.NFTs code](https://github.com/tse-lao/hackathon-fvm/blob/master/contracts/contracts/DB_NFT.sol)  | [Mumbai DB NFTs](https://mumbai.polygonscan.com/address/0x764F56e1953e4dAC1d4c02fAaa5dF3c0DE9b77a2)
[tableland.Bacalhau.Jobs code](https://github.com/tse-lao/hackathon-fvm/blob/master/contracts/contracts/tablelandBacalhauJobs.sol) | [filfoxBacalhauJobs](https://hyperspace.filfox.info/en/address/0x86D9F60d0eaCD6004a123a4F67B67d26B569Fd9C)
[tableland.Deal.Client code](https://github.com/tse-lao/hackathon-fvm/blob/master/contracts/contracts/tablelandDealClient.sol) | [filfoxDealClient](https://hyperspace.filfox.info/en/address/0xa8B737d368e46Cd98AcCa537691115C767016CC5)
[tableland.Deal.Rewarder code](https://github.com/tse-lao/hackathon-fvm/blob/master/contracts/contracts/tablelandDealRewarder.sol) | [filfoxDealRewarder](https://hyperspace.filfox.info/en/address/0xB34133c7F97Bc3B66dD41ac9e5BFB3358A587490)

- [useContract](https://github.com/tse-lao/hackathon-fvm/blob/master/src/hooks/useContract.ts)

# DataBridge Files Utilities

- [Files utilities](https://github.com/tse-lao/hackathon-fvm/tree/master/src/pages/api/files)

# WEB2 to WEB3 data bridge

- [WEB2 Connections](https://github.com/tse-lao/hackathon-fvm/tree/master/src/pages/connections)

## 🥳 UseCase Diagrams 👀

<details>
  <summary>Files & DBs on-boarding</summary>
  <img src="public\FilesOnBoardingUseCase.webp" name="image-name">
  <img src="public\NFTDBCreationUseCase.webp" name="image-name">
  <img src="public\privateRepoUseCase.webp" name="image-name">
</details>

<details>
  <summary>Filecoin Files & DBs Deals</summary>
  <img src="public\dealClientUseCase.webp" name="image-name">
  <img src="public\dealRewarderUseCase.webp" name="image-name">
</details>
<details>
  <summary>Compute Over Data</summary>
  <img src="public\ComputationOverDataUseCase.webp" name="image-name">
</details>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🛠️ Built With

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ethers.js](https://web3js.readthedocs.io/en/v1.3.4/)

## 🤝 Acknowledgements

- [OpenZeppelin](https://openzeppelin.com/)
- [FilecoinHardhatKit](https://github.com/filecoin-project/fvm-starter-kit-deal-making)
- [Lighthouse](https://www.lighthouse.storage/)
- [Tableland](https://tableland.xyz/)
- [Polybase](https://polybase.xyz/)
- [IPFS](https://ipfs.io/)
- All contributors and supporters



