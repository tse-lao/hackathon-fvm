// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./base/LilypadEventsUpgradeable.sol";
import "./interfaces/LilypadCallerInterface.sol";
import "./interfaces/IBacalhauTablelandStorage.sol";

// A way to input new jobs startSpec EndSpec and input format into arrays we put that also inside a table

contract tablelandBacalhauJobs is LilypadCallerInterface, Ownable {
    LilypadEventsUpgradeable bridge;
    IBacalhauTablelandStorage private BacalhauTablelandStorage;

    uint256 public lilypadFee; //=30000000000000000;

    mapping(address => uint) public userFunds;

    constructor(
        LilypadEventsUpgradeable _bridgeContractAddress,
        IBacalhauTablelandStorage bacalhauTablelandStorage
    ) {
        BacalhauTablelandStorage = bacalhauTablelandStorage;

        bridge = _bridgeContractAddress;

        lilypadFee = bridge.getLilypadFee();
    }

    function setLPEventsAddress(address _eventsAddress) public onlyOwner {
        bridge = LilypadEventsUpgradeable(_eventsAddress);
    }

    function getLilypadFee() external {
        lilypadFee = bridge.getLilypadFee();
    }

    function submitFunds() public payable {
        userFunds[msg.sender] = userFunds[msg.sender] + msg.value;
    }

    function withdrawFunds() public {
        require(userFunds[msg.sender] > 0);
        address payable to = payable(msg.sender);
        to.transfer(userFunds[msg.sender]);
    }

    function executeJOB(
        string memory input,
        string memory _specStart,
        string memory _specEnd,
        string memory jobId
    ) public {
        // require(
        //     userFunds[sender] >= lilypadFee,
        //     'Not enough to run Lilypad job'
        // );
        require(address(this).balance >= lilypadFee, "Not enough to run Lilypad job");

        uint bridgeJobId = bridge.runLilypadJob{value: lilypadFee}(
            address(this),
            string.concat(_specStart, input, _specEnd),
            uint8(LilypadResultType.CID)
        );
        require(bridgeJobId > 0, "job didn't return a value");
        BacalhauTablelandStorage.computationInsertion(
            _specStart,
            input,
            _specEnd,
            bridgeJobId,
            jobId,
            msg.sender
        );
    }

    function lilypadFulfilled(
        address _from,
        uint _jobId,
        LilypadResultType _resultType,
        string calldata _result
    ) external override {
        //need some checks here that it a legitimate result
        require(_from == address(bridge)); //really not secure
        require(_resultType == LilypadResultType.CID);
        BacalhauTablelandStorage.updateJobResult(_result, _jobId); //really not secure
    }

    function lilypadCancelled(
        address _from,
        uint _jobId,
        string calldata _errorMsg
    ) external override {
        require(_from == address(bridge));
        BacalhauTablelandStorage.updateJobResult(_errorMsg, _jobId);
    }

    function updateResultDummy(string memory _result, uint256 _jobId) public {
        BacalhauTablelandStorage.updateJobResult(_result, _jobId); //really not secure
    }
}
