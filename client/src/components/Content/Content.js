import React, { Component } from 'react'
import AddAddressForm from "./AddAddressForm";
import Winner from "./Winner";
import AddProposalForm from "./AddProposalForm";
import Info from "./Info";
import ProposalList from "./ProposalList";
import VotersList from "./VotersList";

class Content extends Component {
    render() {
        let {currentAddress} = this.props.state;

        if (this.props.workflowStatus === "0") {
            if (this.props.isOwner) {
                return <AddAddressForm workflowStatus={this.props.workflowStatus} contract={this.props.contract} currentAddress={currentAddress}/>;
            }

            if (this.props.state.voters.includes(currentAddress)) {
                return <Info infoMessage="You are now registered, proposal registration is coming soon"/>;
            }

            return <Info infoMessage="Proposal registration is coming soon"/>;
        } else if (this.props.workflowStatus === "1") {
            if (this.props.isOwner) {
                return (
                    <>
                    <Info infoMessage="Click next step when voters have added enough proposal."/>
                    <ProposalList proposals={this.props.state.proposals}/>
                    </>
                );
            }

            return <AddProposalForm workflowStatus={this.props.workflowStatus} contract={this.props.contract} currentAddress={currentAddress}/>;
        } else if (this.props.workflowStatus === "2") {
            if (this.props.isOwner) {
                return (
                    <>
                        <Info infoMessage="Click next step to start voting."/>
                        <VotersList voters={this.props.state.voters}/>
                        <ProposalList proposals={this.props.state.proposals}/>
                    </>
                );
            }

            return (
                <>
                    <Info infoMessage="Voting will start soon."/>
                    <ProposalList proposals={this.props.state.proposals}/>
                </>
            );
        } else if (this.props.workflowStatus === "3") {
            if (this.props.isOwner) {
                return (
                    <>
                        <Info infoMessage="Click next step to start voting."/>
                        <VotersList voters={this.props.state.voters}/>
                        <ProposalList state={this.props.state} withVote={false} withBadge={true}/>
                    </>
                );
            }

            let vote = this.props.state.votes.find(vote => vote.voter === currentAddress);

            return (
                <>
                    <Info infoMessage={vote !== undefined ? "You have already voted, please wait for tally" : "Start voting for the best proposal."}/>
                    <ProposalList state={this.props.state} withVote={true} withBadge={false}/>
                </>
            );
        } else if (this.props.workflowStatus === "4") {
            if (this.props.isOwner) {
                return (
                    <>
                        <Info infoMessage="Vote is done, please tally."/>
                        <VotersList voters={this.props.state.voters}/>
                        <ProposalList state={this.props.state} withVote={false} withBadge={true}/>
                    </>
                );
            } else {
                return (
                    <>
                        <Info infoMessage="Vote is finished. Wait for the results"/>
                    </>
                );
            }
        } else if (this.props.workflowStatus === "5") {
            if (this.props.isOwner) {
                return (
                    <>
                        <Info infoMessage="Vote is finished."/>
                    </>
                );
            } else {
                return (
                    <>
                        <Info infoMessage="Vote is finished."/>
                        <Winner state={this.props.state}/>
                    </>
                );
            }
        }

        return "";
    }
}

export default Content;
