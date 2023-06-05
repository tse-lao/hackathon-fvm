// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IBacalhauTablelandStorage.sol";
import "./interfaces/IPUSHCommInterface.sol";
import "./interfaces/IBacalhau.sol";

// A way to input new jobs startSpec EndSpec and input format into arrays we put that also inside a table
// We need bounties so can this happen is like someone approves to spend some money to create a bounty for a job
// for the job to get included only if a certain verifiable creadential using polygonID can give access to the job creator to submit that job
// we can have a dao where the owner and other members can vote with their signatures if they want that one

contract tablelandBacalhauJobs is Ownable, AccessControl, IBacalhau {
    using EnumerableSet for EnumerableSet.UintSet;

    using Counters for Counters.Counter;
    Counters.Counter private jobIDs;
    Counters.Counter private requestIDs;
    Counters.Counter private bountyIDs;

    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    uint256 public JobFee = 0; //=30000000000000000;

    mapping(uint256 => Request)private requestByID;

    mapping(address => EnumerableSet.UintSet) private addressCreatedBounties;

    mapping(uint256 => jobBounty) private bountyInfoMap;

    mapping(uint256 => Job) private jobInfoMap;
    
    mapping(string => bool) public jobExecuted;

    mapping(uint256 => address) public jobTaken;

    IBacalhauTablelandStorage private BacalhauTablelandStorage;

    constructor(IBacalhauTablelandStorage bacalhauTablelandStorage) {
        BacalhauTablelandStorage = bacalhauTablelandStorage;
        _grantRole(EXECUTOR_ROLE, 0xf129b0D559CFFc195a3C225cdBaDB44c26660B60);
    }

    function createBounty(
        string memory name,
        string memory description,
        string memory dataFormat
    ) public payable {
        bountyIDs.increment();
        uint256 currentBounty = bountyIDs.current();
        bountyInfoMap[currentBounty] = jobBounty(
            name,
            description,
            dataFormat,
            msg.value,
            address(0)
        );
        addressCreatedBounties[msg.sender].add(currentBounty);
        BacalhauTablelandStorage.BountyInsertion(
            currentBounty,
            name,
            description,
            dataFormat,
            msg.value,
            msg.sender
        );
    }

    function assignBountyResult(
        uint256 bountyID,
        string memory name,
        string memory description,
        string memory dataFormat,
        string memory startCommand,
        string memory endCommand,
        uint256 numberOfInputs,
        address payable bountyWinner
    ) public {
        require(bountyInfoMap[bountyID].bountyWinner == address(0), "Bounty already claimed");
        require(
            addressCreatedBounties[msg.sender].contains(bountyID),
            "you did not created that bounty"
        );
        createJOB(
            name,
            description,
            dataFormat,
            startCommand,
            endCommand,
            numberOfInputs,
            bountyWinner
        );
        bountyWinner.transfer(bountyInfoMap[bountyID].reward);
        BacalhauTablelandStorage.updateBountyWinner(bountyWinner, bountyID);
    }

    function createJOB(
        string memory name,
        string memory description,
        string memory dataFormat,
        string memory startCommand,
        string memory endCommand,
        uint256 numberOfInputs,
        address creator
    ) public {
        jobIDs.increment();
        uint256 currentJobID = jobIDs.current();

        jobInfoMap[currentJobID] = Job(startCommand, endCommand, numberOfInputs, creator);

        BacalhauTablelandStorage.jobInsertion(
            currentJobID,
            name,
            description,
            dataFormat,
            startCommand,
            endCommand,
            numberOfInputs,
            msg.sender
        );
    }

    function executeJOB(uint256 jobID, string[] memory inputs) public payable {
        require(msg.value >= JobFee, "Not enough to run Lilypad job");
        require(jobID <= jobIDs.current());
        require(jobInfoMap[jobID].numberOfInputs == inputs.length);

        string memory input;
        if (inputs.length != 0) {
            input = inputs[0];
            for (uint256 i = 1; i < inputs.length; i++) {
                input = string.concat(input, ",", inputs[i]);
            }
        }

        // require(!jobExecuted[command], "this job is already executed");

        // jobExecuted[command] = true;

        requestIDs.increment();
        uint256 currentRequestID = requestIDs.current();
        requestByID[currentRequestID] = Request(msg.sender,msg.value);
        // Job memory jobCalled = Job(thisJobId, cmd);
        emit newJobRequest(
            currentRequestID,
            jobInfoMap[jobID].startCommand,
            jobInfoMap[jobID].endCommand,
            input
        );

        BacalhauTablelandStorage.computationInsertion(jobID, input, currentRequestID, msg.sender);
        // address payable recipient = payable(msg.sender);
        // recipient.transfer(msg.value);
        // emit ExecutionPaid(recipient, msg.value);
    }

    function ExecutionStarted(
        uint requestID,
        string calldata bacalhauJobID
    ) public onlyRole(EXECUTOR_ROLE) {
        require(jobTaken[requestID] == address(0));

        jobTaken[requestID] = msg.sender;

        string[] memory set = new string[](2);
        set[0] = bacalhauJobID;
        set[1] = "executionStarted";
        BacalhauTablelandStorage.updateJobResult(set, requestID);

        //"0+3+Hooray! ", msg.sender, " sent ", token amount, " PUSH to you!"
        // IPUSHCommInterface(0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa).sendNotification(
        //     0x0D1781F0b693b35939A49831A6C799B938Bd2F80, // from channel
        //     address(this), // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
        //     bytes(
        //         string(
        //             // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
        //             abi.encodePacked(
        //                 "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
        //                 "+", // segregator
        //                 "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
        //                 "+", // segregator
        //                 "Tranfer Alert", // this is notificaiton title
        //                 "+", // segregator
        //                 "Hooray! ", // notification body
        //                 Strings.toHexString(msg.sender), // notification body
        //                 " sent ", // notification body
        //                 // Strings.toString(amount.div(10 ** uint(decimals()))), // notification body
        //                 " PUSH to you!" // notification body
        //             )
        //         )
        //     )
        // );
    }

    function ExecutionFulfilled(
        uint requestID,
        string calldata _result
    ) public onlyRole(EXECUTOR_ROLE) {
        require(jobTaken[requestID] == msg.sender);
        BacalhauTablelandStorage.updateJobResult(_result, requestID);
        address payable recipient = payable(msg.sender);
        recipient.transfer(requestByID[requestID].pool);
        emit ExecutionPaid(recipient, requestByID[requestID].pool);

        //"0+3+Hooray! ", msg.sender, " sent ", token amount, " PUSH to you!"
        // IPUSHCommInterface(0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa).sendNotification(
        //     0x0D1781F0b693b35939A49831A6C799B938Bd2F80, // from channel
        //     address(this), // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
        //     bytes(
        //         string(
        //             // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
        //             abi.encodePacked(
        //                 "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
        //                 "+", // segregator
        //                 "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
        //                 "+", // segregator
        //                 "Tranfer Alert", // this is notificaiton title
        //                 "+", // segregator
        //                 "Hooray! ", // notification body
        //                 Strings.toHexString(msg.sender), // notification body
        //                 " sent ", // notification body
        //                 // Strings.toString(amount.div(10 ** uint(decimals()))), // notification body
        //                 " PUSH to you!" // notification body
        //             )
        //         )
        //     )
        // );
    }

    function ExecutionCancelled(
        uint _jobId,
        string calldata bacalhauJobID,
        string calldata _errorMsg
    ) public onlyRole(EXECUTOR_ROLE) {
        string[] memory set = new string[](2);
        set[0] = bacalhauJobID;
        set[1] = _errorMsg;
        BacalhauTablelandStorage.updateJobResult(set, _jobId);

        //"0+3+Hooray! ", msg.sender, " sent ", token amount, " PUSH to you!"
        // IPUSHCommInterface(0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa).sendNotification(
        //     0x0D1781F0b693b35939A49831A6C799B938Bd2F80, // from channel
        //     address(this), // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
        //     bytes(
        //         string(
        //             // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
        //             abi.encodePacked(
        //                 "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
        //                 "+", // segregator
        //                 "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
        //                 "+", // segregator
        //                 "Tranfer Alert", // this is notificaiton title
        //                 "+", // segregator
        //                 "Hooray! ", // notification body
        //                 Strings.toHexString(msg.sender), // notification body
        //                 " sent ", // notification body
        //                 // Strings.toString(amount.div(10 ** uint(decimals()))), // notification body
        //                 " PUSH to you!" // notification body
        //             )
        //         )
        //     )
        // );
    }

}

