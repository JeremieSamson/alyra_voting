// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.13;

import "remix_tests.sol";
import "remix_accounts.sol";
import "../contracts/VotingForTU.sol";

contract VotingTest is Voting {
    address acc0;
    address acc1;
    uint proposalId;

    function beforeAll() public {
        acc0 = TestsAccounts.getAccount(0);
        acc1 = TestsAccounts.getAccount(1);
    }

    function ownerTest() public {
        Assert.equal(owner(), acc0, "Owner should be acc0");
    }

    function initialStatusTest () public {
        Assert.equal(uint(winningProposalId), uint(0), "Winning proposal ID must be equal to 0");
    }

    function testAddInWhitelist () public {
        Assert.equal(uint(totalVoters), uint(0), "Total voters count must be equal to 0");
        addInWhitelist(acc0);
        Assert.equal(uint(totalVoters), uint(1), "Total voters count must be equal to 1 after a whitelist addition");
    }

    function testStartProposalRegistration() public {
        Assert.equal(uint(currentSessionStatus), uint(WorkflowStatus.RegisteringVoters), "At start status must be equel to RegisteringVoters");
        startProposalRegistration();
        Assert.equal(uint(currentSessionStatus), uint(WorkflowStatus.ProposalsRegistrationStarted), "Status must be ProposalsRegistrationStarted after starting proposal registration");
    }

    function testAddProposal() public {
        Assert.equal(uint(proposalsCount), uint(0), "Proposals count must be equal to 0");
        proposalId = addProposal("Proposal");
        Assert.equal(uint(proposalId), uint(1), "Proposal id returned must be equal to 1");
        Assert.equal(uint(proposalsCount), uint(1), "Proposals count must be equal to 1");
    }

    function testEndProposalRegistration() public {
        Assert.equal(uint(currentSessionStatus), uint(WorkflowStatus.ProposalsRegistrationStarted), "At start status must be equal to RegisteringVoters");
        endProposalRegistration();
        Assert.equal(uint(currentSessionStatus), uint(WorkflowStatus.ProposalsRegistrationEnded), "Status must be ProposalsRegistrationEnded after starting proposal registration");
    }

    function testStartVotingSession() public {
        Assert.equal(uint(currentSessionStatus), uint(WorkflowStatus.ProposalsRegistrationEnded), "At start status must be equal to ProposalsRegistrationEnded");
        startVotingSession();
        Assert.equal(uint(currentSessionStatus), uint(WorkflowStatus.VotingSessionStarted), "Status must be VotingSessionStarted after ending proposal registration");
    }

    function testVote() public {
        Assert.equal(bool(voters[acc0].isRegistered), bool(true), "Voter 1 should have been registered");
        Assert.equal(bool(voters[acc0].hasVoted), bool(false), "Voter 1 should not have voted yet");
        Assert.equal(uint(voters[acc0].votedProposalId), uint(0), "Voter 1 should not have a vote proposal id yet");
        Assert.equal(uint(proposals[proposalId].voteCount), uint(0), "Proposal should not have vote yet");
        vote(proposalId);
        Assert.equal(bool(voters[acc0].isRegistered), bool(true), "Voter 1 should still be registered");
        Assert.equal(bool(voters[acc0].hasVoted), bool(true), "Voter 1 should have voted");
        Assert.equal(uint(voters[acc0].votedProposalId), uint(proposalId), "Voter 1 should have a vote proposal id");
        Assert.equal(uint(proposals[proposalId].voteCount), uint(1), "Proposal should have one vote");
    }

    function testEndVotingSession() public {
        Assert.equal(uint(currentSessionStatus), uint(WorkflowStatus.VotingSessionStarted), "At start status must be equal to VotingSessionStarted");
        endVotingSession();
        Assert.equal(uint(currentSessionStatus), uint(WorkflowStatus.VotingSessionEnded), "Status must be VotingSessionEnded after ending proposal registration");
    }

    function testStartTalliedVotes() public {
        Assert.equal(uint(proposalsCount), uint(1), "Proposals count must be equal to 1");
        Assert.equal(uint(currentSessionStatus), uint(WorkflowStatus.VotingSessionEnded), "At start status must be equal to VotingSessionEnded");
        Assert.equal(uint(winningProposalId), uint(0), "Winning proposal id should be equal to 0");
        startTalliedVotes();
        Assert.equal(uint(currentSessionStatus), uint(WorkflowStatus.VotesTallied), "Status must be VotesTallied after ending proposal registration");
        Assert.equal(uint(winningProposalId), uint(1), "Winning proposal id should be equal to 1");
    }
}
