import DBAbi from "./DB_NFT.abi.json"
import crossChainBacalhauJobsAbi from "./BacahlauJobs.abi.json"
import TWFactoryAbi from "./ThirdWebFactory.abi.json"
import helperAbi from "./helper.abi.json"
import splitterAbi from "./splitter.abi.json"
import {crossChainBacalhauJobs_address,DB_NFT_address,TWFactoryAddress,splitImplementation,helper} from "./contractAddress"
import {DB_attribute,DB_main,data_contribution,computation,} from "./tableland"

export {
    DBAbi,
    crossChainBacalhauJobs_address,
    DB_NFT_address,
    DB_attribute,
    DB_main,
    data_contribution,
    computation,
    crossChainBacalhauJobsAbi,
    TWFactoryAbi,
    TWFactoryAddress,
    splitImplementation,
    helper,
    helperAbi,
    splitterAbi

}