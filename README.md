<h1>
 Welcome to DataBridge 💾🌉
</h1>

<p>
<img src="public\logo (1).webp" alt="alt text" width="40%"/>
</p> 

- [Demo video](https://www.youtube.com/watch?v=1scDw7K2KPU)
- [dapp link](https://hackathon-fvm-fj45.vercel.app/)

**Authors**
 * [nijoe1](https://github.com/nijoe1)
 * [tse-lao](https://github.com/tse-lao)

#####  Project improvements on the HackFS 2023 Hackathon . 

- [prev_README](https://github.com/tse-lao/hackathon-fvm/blob/master/README.md)

## 
 
## Project Description
DataBridge: Empowering Decentralized Data Management
DataBridge is a revolutionary decentralized platform designed to empower companies and groups in managing and curating valuable datasets. By seamlessly integrating the Bacalhau server, improved dealClient contract, and new multisig features, DataBridge provides a secure and efficient solution for data collaboration, verifiable computations, and storage on the Filecoin network.

### DataBridge offers the following key improvements:

#### Improved Bacalhau Server
The Bacalhau server has been enhanced to handle any operation within the network. It now utilizes a Lilypad-inspired architecture and integrates a contract with Tableland for decentralized SQL-based contract indexing. This integration enables users to create Job bounty requests using the newly established Oracle contract. The workflow involves describing the desired job, creating a bounty request, and receiving proposals from data scientists. The bounty creator selects the most suitable proposal, assigns it to the winner, and rewards them with the bounty. This incentivizes job creators and benefits the Bacalhau executor server, similar to Lilypad's approach.

#### Enhanced dealClient Contract
The dealClient contract now functions as a dataDAO, allowing members to request storage on the Filecoin network and replicate important files. It can handle multiple replication requests for a single file, ensuring redundancy and data availability. The contract has been integrated with a table in Tableland, simplifying access to deals published by storage providers. Additionally, it utilizes the Filecoin dataCap API to query the network and make verified deals, further enhancing data management capabilities.

#### New Multisig Features
DataBridge introduces a fully functional multi-sig wallet contract that integrates seamlessly with Tableland. This contract enables decentralized and efficient tracking of proposals and metadata. Members of the contract can manage files, create proposals, and merge database entries into a single CID at the end of each day. JSON merging is supported, facilitating collaboration and data consolidation. Companies or multisigs can convert merged DBs into NFTs, providing exclusive access to encrypted files, folders, and DBs for NFT holders. This approach allows companies to generate revenue by offering their data and provides a streamlined process for managing files, granting dataCap, and making verified deals on the Filecoin network.

DataBridge empowers users with a robust framework for securely managing and collaborating on data, conducting verifiable computations, and deriving value from shared information. The platform seamlessly integrates with Tableland, offering efficient data management and access control, while leveraging the power of the Bacalhau server and improved dealClient contract for enhanced functionality. Experience the future of decentralized data management with DataBridge.


## 🧑‍💻Technologies Used 🤖

# Bacalhau
# Tableland

# Lighthouse
# Polybase


## Architecture
## 🛠️ Built With

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ethers.js](https://web3js.readthedocs.io/en/v1.3.4/)



## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🤝 Acknowledgements

- [OpenZeppelin](https://openzeppelin.com/)
- [FilecoinHardhatKit](https://github.com/filecoin-project/fvm-starter-kit-deal-making)
- [Lighthouse](https://www.lighthouse.storage/)
- [Tableland](https://tableland.xyz/)
- [Polybase](https://polybase.xyz/)
- [IPFS](https://ipfs.io/)
- All contributors and supporters

 Open your browser and visit `http://localhost:3000` to view the app.