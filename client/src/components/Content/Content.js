import React, { Component } from 'react'
import AddAddressForm from "./AddAddressForm";
import Winner from "./Winner";
import AddProposalForm from "./AddProposalForm";
import Info from "./Info";
import ProposalList from "./ProposalList";
import VotersList from "./VotersList";

class Content extends Component {
    render() {
        let {currentAddress, isOwner, voters, workflowStatus, votes} = this.props.state;

        if (!isOwner && !voters.includes(currentAddress)) {
            return <Info infoMessage="You are not registered."/>;
        }

        if (workflowStatus === "0") {
            if (isOwner) {
                return <AddAddressForm state={this.props.state}/>;
            }

            if (voters.includes(currentAddress)) {
                return <Info infoMessage="You are now registered, proposal registration is coming soon"/>;
            }

            return <Info infoMessage="Proposal registration is coming soon"/>;
        } else if (workflowStatus === "1") {
            if (isOwner) {
                return (
                    <>
                    <Info infoMessage="Click next step when voters have added enough proposal."/>
                    <VotersList voters={voters}/>
                    <ProposalList state={this.props.state} withVote={false} withBadge={false}/>
                    </>
                );
            }

            return <AddProposalForm state={this.props.state}/>;
        } else if (workflowStatus === "2") {
            if (isOwner) {
                return (
                    <>
                        <Info infoMessage="Click next step to start voting."/>
                        <VotersList voters={voters}/>
                        <ProposalList state={this.props.state}/>
                    </>
                );
            }

            return (
                <>
                    <Info infoMessage="Voting will start soon."/>
                    <ProposalList state={this.props.state}/>
                </>
            );
        } else if (workflowStatus === "3") {
            if (isOwner) {
                return (
                    <>
                        <Info infoMessage="Click next step to start voting."/>
                        <VotersList voters={voters}/>
                        <ProposalList state={this.props.state} withVote={false} withBadge={true}/>
                    </>
                );
            }

            let vote = votes.find(vote => vote.voter === currentAddress);

            return (
                <>
                    <Info infoMessage={vote !== undefined ? "You have already voted, please wait for tally" : "Start voting for the best proposal."}/>
                    <ProposalList state={this.props.state} withVote={true} withBadge={false} vote={vote}/>
                </>
            );
        } else if (workflowStatus === "4") {
            if (isOwner) {
                return (
                    <>
                        <Info infoMessage="Vote is done, please tally."/>
                        <VotersList voters={voters}/>
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
        } else if (workflowStatus === "5") {
            if (isOwner) {
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
