// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title A simple Voting smart contract
 * @author Cyril Castagnet && Jérémie Samson
 * @dev Simple voting system deployed with truffle
 */
contract Voting is Ownable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    uint public winningProposalID;
    uint8 arrayLimitation = 100;

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId, string description);
    event Voted (address voter, uint proposalId);

    /**
     * @dev Check if user is a registered voter
     */
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    /**
     * @dev Get a voter from a specified address
     * @param _addr Voter's address
     * @return Voter Voter object
     */
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }

    /**
     * @dev Get a proposal from a specified proposal id
     * @param _id Proposal id
     * @return Proposal Proposal object
     */
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

    /**
     * @dev register a voter
     * @param _addr Voter's address
     */
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voters registration is not open yet");
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    /**
     * @dev Add a proposal by a voter
     * @param _desc proposal description
     */
    function addProposal(string memory _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposals are not allowed yet");
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), "Vous ne pouvez pas ne rien proposer"); // facultatif
        require(proposalsArray.length <= arrayLimitation, "Only 100 proposals allowed for security purpose");

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1, proposal.description);
    }

    /**
     * @dev vote for a proposal by a voter
     * @param _id proposal id
     */
    function vote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session havent started yet");
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id <= proposalsArray.length, "Proposal not found");

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    /**
     * @dev Start proposal registration function for the owner
     */
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Registering proposals cant be started now");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /**
     * @dev End proposal registration function for the owner
     */
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Registering proposals havent started yet");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /**
     * @dev Start voting session function for the owner
     */
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "Registering proposals phase is not finished");
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /**
     * @dev End voting session function for the owner
     */
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session havent started yet");
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /**
     * @dev Tally vote function for the owner
     */
    function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
        uint _winningProposalId;
        for (uint256 p = 0; p < proposalsArray.length; p++) {
            if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
                _winningProposalId = p;
            }
        }
        winningProposalID = _winningProposalId;

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}