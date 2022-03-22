// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    uint public winningProposalId;
    WorkflowStatus public currentSessionStatus;
    uint proposalsCount;
    mapping(uint => Proposal) public proposals;
    mapping(address => bool) public whitelist;
    uint totalVoters;
    mapping(address => Voter) public voters;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
    event Tallied (uint proposalId);

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }


    modifier isWhitelisted() {
        require(whitelist[msg.sender], "You are not whitelisted.");
        _;
    }

    modifier didNotVote() {
        require(voters[msg.sender].hasVoted == false, "You have already voted.");
        _;
    }

    modifier isSessionInStatus(WorkflowStatus _workflowStatusRequired) {
        require(currentSessionStatus == _workflowStatusRequired, "The status of the session is in a wrong state");
        _;
    }

    constructor() {
        currentSessionStatus = WorkflowStatus.RegisteringVoters;
    }

    function addInWhitelist(address _addressToWhitelist) public onlyOwner isSessionInStatus(WorkflowStatus.RegisteringVoters){
        whitelist[_addressToWhitelist] = true;
        voters[_addressToWhitelist] = Voter(true, false, 0);
        totalVoters++;

        emit VoterRegistered(_addressToWhitelist);
    }

    function startProposalRegistration() public onlyOwner isSessionInStatus(WorkflowStatus.RegisteringVoters) {
        require(totalVoters > 0, "To start proposal registration you need at least one voter");

        updateSessionStatus(WorkflowStatus.ProposalsRegistrationStarted);
    }

    function addProposal(string memory _proposal) public isWhitelisted isSessionInStatus(WorkflowStatus.ProposalsRegistrationStarted) returns(uint){
        for (uint i=0 ; i<proposalsCount ; i++) {
            require (keccak256(abi.encodePacked(proposals[i].description)) == keccak256(abi.encodePacked(_proposal)), "This description already exists.");
        }

        proposalsCount++;
        uint proposalId = proposalsCount;
        proposals[proposalId] = Proposal(_proposal, 0);

        emit ProposalRegistered(proposalId);

        return proposalId;
    }

    function endProposalRegistration() public onlyOwner isSessionInStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        updateSessionStatus(WorkflowStatus.ProposalsRegistrationEnded);
    }

    function startVotingSession() public onlyOwner isSessionInStatus(WorkflowStatus.ProposalsRegistrationEnded) {
        require(totalVoters > 0, "To start voting registration you need at least one voter");

        updateSessionStatus(WorkflowStatus.VotingSessionStarted);
    }

    function vote(uint _proposalId) public isWhitelisted didNotVote isSessionInStatus(WorkflowStatus.VotingSessionStarted){
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;

        proposals[_proposalId].voteCount++;

        emit Voted(msg.sender, _proposalId);
    }

    function endVotingSession() public onlyOwner isSessionInStatus(WorkflowStatus.VotingSessionStarted) {
        updateSessionStatus(WorkflowStatus.VotingSessionEnded);
    }

    function startTalliedVotes() public onlyOwner isSessionInStatus(WorkflowStatus.VotingSessionEnded) {
        updateSessionStatus(WorkflowStatus.VotesTallied);

        tally();
    }

    function tally() private {
        uint maxVoteCount;
        uint tempWinnerProposalId;
        for (uint i=0 ; i<=proposalsCount ; i++) {
            if (proposals[i].voteCount > maxVoteCount) {
                maxVoteCount = proposals[i].voteCount;
                tempWinnerProposalId = i;
            }
        }

        winningProposalId = tempWinnerProposalId;
    }

    function updateSessionStatus(WorkflowStatus _newSessionStatus) private {
        WorkflowStatus previousSessionStatus = currentSessionStatus;
        currentSessionStatus = _newSessionStatus;
        emit WorkflowStatusChange(previousSessionStatus, _newSessionStatus);
    }
}
