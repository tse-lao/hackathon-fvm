# HACK FS priorities

check out this about the findings. 

[Compute over Data with Bacalhau](https://www.notion.so/Compute-over-Data-with-Bacalhau-f77bb4b3592341f4ac4a36a140ebea38)

[General TODO List](https://www.notion.so/General-TODO-List-95ce02c6be964429b8b4cdfd9f71576e)

## KOEN TODOs

- [x]  Bacalhau server that can take requests to execute jobs and then send the results back to a server or even execute the transaction to update the result in the contract
- [x]  Try to figure out how to upload a wasm program in directory
- [x]  Create seperate module.
- [x]  How to call a docker image or node to run the command:
- [x]  figure out some rust codes.
- [x]  convert python script to wasm.
- [x]  Request Bounties
- [x]  Create Bounty Request marketplace.

**UI updates done 2 june.** 

- [x]  Create Job
- [x]  Create Job Bounty
- [x]  Display Job Bounty
- [x]  Show datasets available
- [x]  Show Computations over Data
- [x]  Job Request Details.

**TODO’s**

- [ ]  We need to retrieve all the data for the above pages i will push to showcase which data i now want to display, if possible can you make those requests in tableland.most connections have been made with the backend just verify all the correct namings. 
- [ ]  Create or select existing datasets for computations
- [ ]  Find the best way to select multiple files.
- [ ]  Make the upload file modular so we can integrate it in different elements of the application.
  

**First finish all our tasks that are open to make sure that we are able to move forward and implement even cooler tech solutions.** 

```bash
bacalhau wasm run [input_wasm] [start_command] \ [command] \\ -i ipfs://[input_cid_dir]
```

## NICK TODOs

- [ ]  Create the new bacalhau contracts
- [ ]  Make the contract like third web factory compatible !!! So we can deploy numerous types of jobs
- [ ]  Create architecture of the flow of execution
- [ ]  Create a private repo managed by one address to add pkps
- [ ]  Check how we can use PKPs to trigger transactions and sign messages