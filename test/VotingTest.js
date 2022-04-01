const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');
const Voting = artifacts.require('Voting');

contract('Initialisation', function (accounts) {
    const owner = accounts[0];
    const voter = accounts[1];

    before(async function () {
        this.Voting = await Voting.new({from: owner});
    });

    it('Ownership has been transferred', async function () {
        expect(await this.Voting.owner()).to.equal(owner);
    });

    it('A voter can not access voters information if he has not been registered', async function () {
        await expectRevert(this.Voting.getVoter(voter, {from: voter}), 'You\'re not a voter');
    });
});

contract('As an admin, I should be able to add voters', function (accounts) {
    const owner = accounts[0];
    const voter = accounts[1];
    const voter2 = accounts[2];

    before(async function () {
        this.Voting = await Voting.new({from: owner});
    });

    it('Only the owner can add voters', async function () {
        await expectRevert(this.Voting.addVoter(voter2, {from: voter}), 'Ownable: caller is not the owner');
    });

    it('The workflow status must be equal to RegisteringVoters', async function () {
        let currentStatus = await this.Voting.workflowStatus.call();
        let expectedStatus =  new BN(0);

        expect(currentStatus).to.be.bignumber.equal(expectedStatus);
    });

    it('An address could not be registered more than once', async function () {
        const resultSuccessAddVoter = await this.Voting.addVoter(voter);
        expectEvent(resultSuccessAddVoter, "VoterRegistered", { voterAddress: voter});

        let newVoter = await this.Voting.getVoter(voter, {from: voter});
        expect(newVoter.isRegistered).to.equal(true);
        expect(newVoter.hasVoted).to.equal(false);
        expect(newVoter.votedProposalId).to.be.bignumber.equal(new BN(0));

        await expectRevert(this.Voting.addVoter(voter), 'Already registered');
    });
});

contract('As a voter, I should be able to add a proposal', function (accounts) {
    const owner = accounts[0];
    const voter = accounts[1];
    const noVoter = accounts[2];

    before(async function () {
        this.Voting = await Voting.new({from: owner});
        this.Voting.addVoter(voter);
    });

    it('The workflow status must be equal to ProposalsRegistrationStarted after starting proposals registration', async function () {
        let currentStatus = await this.Voting.workflowStatus.call();
        let registeringVotersStatus =  new BN(0);
        let proposalsRegistrationStartedStatus =  new BN(1);

        expect(currentStatus).to.be.bignumber.equal(registeringVotersStatus);
        const resultStartProposalsRegistering= await this.Voting.startProposalsRegistering();
        expectEvent(resultStartProposalsRegistering, "WorkflowStatusChange", {
            previousStatus: registeringVotersStatus,
            newStatus: proposalsRegistrationStartedStatus
        });

        currentStatus = await this.Voting.workflowStatus.call();
        expect(currentStatus).to.be.bignumber.equal(proposalsRegistrationStartedStatus);
    });

    it('Only a voter can add a proposal', async function () {
        await expectRevert(this.Voting.addProposal("foo", {from: noVoter}), 'You\'re not a voter');
    });

    it('A voter can\'t add an empty proposal', async function () {
        await expectRevert(this.Voting.addProposal("", {from: voter}), 'Vous ne pouvez pas ne rien proposer');
    });

    it('A voter can add a proposal', async function () {
        let proposalId = new BN(0);
        await expectRevert(this.Voting.getOneProposal(proposalId,  {from: voter}), 'revert');

        let addProposalResult = await this.Voting.addProposal('Lorem Ipsum', {from: voter});
        expectEvent(addProposalResult, 'ProposalRegistered', {
            proposalId: proposalId,
        });

        let newProposal = await this.Voting.getOneProposal(proposalId,  {from: voter});
        expect(newProposal.description).to.equal('Lorem Ipsum');
        expect(newProposal.voteCount).to.be.bignumber.equal(proposalId);
    });
});