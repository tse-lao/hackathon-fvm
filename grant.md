# Roadmap

**Introduction.** 

- We are trying to create one place where all data can be users data can be collected.
- Big issue for many companies to deal with data privacy laws.
- We would like the users to gain more insights in their data
- Also we want to give users the opportunity to earn from their collected data.
- Provide companies to collect this data from users
- Help users to perform computations over the data.

**Creating Data Collections [open/private data]**

- A data collector makes a request for data by specifying the following inputs: the database name, description, categories, dataformat. We help the data collector to analyze their example input on the metadata.
- Data owner with the matching metadata are able to share their data files to the data collection. (both encrypted as open data)
- Our software validates each insertion that complies with the database entries format and signs a message of the contribution inputs
- The  Smart Contract accepts only signatures created by the DataBridge backend
- After the minimum required rows and contribution are inserted the data collector is able to generate a new dataset and set a price.

*Version 2:* 

- We need to make sure that a certain treshold has been reached before the data is able to merge it all together. ← required update in contract
    - We need lighthouse response to share us the option for a one time decryption key → hacky way to do now is with share access  to our backend user and revoke the access upon creation
- We need renaming upon multiple agreed names to make sure that we use everything correctly everywhere. Since too much workload the past hacathon things got messy.

**Data/ File Management System** 

- Users are able to upload their data in a private and secure option.
- When uploading we automatically generate a car for every file and we store these files in a secure environment on polybase for the user.
- The user is now able to automatically create deals on filecoin to store their files for a certain period of time. Hereby we provide the users to option to store their files permanently.
- Users are able to import large amount of data from different platforms like Facebook, Google and Twitter and we automatically encrypt, analyze and store it. Users can choose to permanently store these files.

*Version 2:* 

- Create better sharing options for the users.
- Create more options to onboard different sets of data.

**Private Groups.** 

- We allow users to create groups in the application to share data to everyone in the group.
- When creating the group we generate a Merkle Tree of all the users.
- We store all the users in the a immmutable tableland database.
- When the group owner wants to add or remove a users from the group it needs to validate his correct path from his address to the root.
- Only the group owner is able to change access control of groups.
- Ones someone leave it loses access to all the files in the group accept his own contirbuted files.

*Version 2:* 

- Make sure that users first need to accept before added to a group. Otherwise this can cause for problems.
- Add the functionality that we can do it also based on timestamp, for provide only select group to has access to the files from timestamp_start ⇒ timestamp_end.

**“Compute over Data” Jobs. [new]**

- Add computations entrypoints in Polybase to prepare for computing.
- Match potential computational options based on matching dataformat.

*Version 2.* 

- Integrate a backend solution with bacalhau so we can talk to the bacalhau network and perform real computations.
- Change our temporarily backend solution of merge files towards a bacalhau solution
- Provide default list of verified computations
- Move the logic to the chain, so computations can be verified and reward for the creators.
- We provide data scientist and engineers to perform bounties based on data owners request.
- An overview is available of all the computation performed by our contract.
- We reward all the contributors that has contributed anywhere in the process, with our algorithmic splitter.

**Account Profiles [new]**

- Create name with tableland.
- Create social publicly available links.
- Give user the option to select own digital collection as profile picture.

### Brainstorm session for version 3

**Compute over Private data.** 

- We might provide our own logic within the computation that can be used like a @openzeppelin library where within the computation we decrypt a file perform copmutation over it and then send it back encrypted to the user

**ZK-proof integrations.** 

- Intergrate API connections with zk-Proof.
- Proof and reduce the risk of abuse by multiple different data providing.
    - Let users join our discord server
        - Login in our application they need to provide the zkProof that they are joined to server.
        - Send it to our contract and then we mint a Komojicat for them.

**Proof of source**

- We want to prove that data is coming from a specific source, not sure yet what is the best way to do this. Maybe we can connect with the zkProof of discord to see if he is interested in checking it out.

**Tokenized Voting System** 

- more details coming..
- community staking, community rewarding.
- fees for computational power and creation of datasets, computational jobs etc…

**ZK-Data Sharing.**

- Provide details about your data profile to third parties without revealing your identity.
- Get rewarded for the sharing without the traceback of the results.
- **Needs more research but we would like to build this in Paris**

Use Cases

**Billboard management system.** 

- Create billboard certificates holding locational data and verify the proof of existence.
- Create different time slots of within for this certiciate that can be sold to third parties.
- Integrate our data collection and data stream for specific billboard certificate.
- Let our users share their data profiles with the billboard ones the have been within a certain range.
- Share data from the billboard to specific users within time slots.
- Integrate a solution for proposal that needs to be verfiied by the billboard certificate stakeholders to validate that the inputs are according to the laws and terms and conditions.

**Campaign Management.** 

- Integrate a workflow of campaign managent within the billboard managment system.
- Provide shared access and controls over execute based on owned billboards.

**Customer Vouchers** 

- Analyze individuals users social media presence and reward their contribution with vouchers, digital collectible, discounts or goodies.
- We might be able to reward early joined users for some channels with special gifts.

**Digital Advertisement tracking** 

- With our custom extension, users are able to collect all different kind of data while browsing the web.
- We can read the different ads displayed on the site and store these data in the user application.
- Once we got verified advertisers our users can decide to share their data profiles to these advertisers in exchange for payments.
- Give better insights for advertisers and website owners who cisting their website an extenstion to Google Analytics.

**Account Abstraction.** 

- own and connect multiple accounts without showing their relationship.
- create the option to perform actions cross account.
- good recovery and backup system.

*If we are able to onboard data from different platforms, the is a good likelyhood that the users does not want to be identified cross platform with the same accounts. We need to find a abstraction that makes it possible to own several accounts without showing the link between those accounts. In the meantime we want to make sure that the user still is able to get full control over all their data from different accounts.* 

[***https://eips.ethereum.org/EIPS/eip-4337***](https://eips.ethereum.org/EIPS/eip-4337)

*Allow users to use smart contract wallets containing arbitrary verification logic instead of EOAs as their primary account. Completely remove any need at all for users to also have EOAs (as status quo SC wallets and [EIP-3074](https://eips.ethereum.org/EIPS/eip-3074) both require)*