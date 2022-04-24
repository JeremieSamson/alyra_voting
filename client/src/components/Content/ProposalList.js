import React, { Component } from 'react'
import Info from "./Info";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {NotificationManager} from "react-notifications";

class ProposalList extends Component {
    async handleVote(proposalId) {
        let {contract, currentAddress} = this.props.state;

        try {
            await contract.methods.vote(proposalId).send({from: currentAddress});
            NotificationManager.success('Congrats, you have voted', 'New vote', 2000);
        } catch (err) {
            NotificationManager.error('An error occured when voting', '', 2000);
            console.log(err);
        }
    }

    render() {
        if (this.props.state.proposals.length === 0) {
            return <Info infoMessage="There is no proposal yet"/>;
        }

        if (this.props.withVote) {
            return (
                <>
                    <h1>List of proposals</h1>
                    <ul className="list-group">
                        {this.props.state.proposals.map(proposal =>
                            <li className={this.props.vote !== undefined && this.props.vote.proposalId === proposal.proposalId ? "list-group-item list-group-item-success" : "list-group-item list-group-item-secondary"}>{proposal.description}
                                <button className="icon-right" onClick={() => this.handleVote(proposal.proposalId)} disabled={this.props.vote !== undefined}>
                                    <FontAwesomeIcon icon={faArrowUp} />
                                </button>
                            </li>)
                        }
                    </ul>
                </>
            );
        }

        if (this.props.withBadge) {
            return (
                <>
                    <h1>List of proposals with votes</h1>
                    <ul className="list-group">
                        {this.props.state.proposals.map(proposal =>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                {proposal.description}
                                <span className="badge badge-primary badge-pill">
                                    {this.props.state.votes.filter(vote => vote.proposalId === proposal.proposalId).length}
                                </span>
                            </li>)
                        }
                    </ul>
                </>
            );
        }

        return (
            <>
                <h1>List of proposals</h1>
                <ul className="list-group">
                    {this.props.state.proposals.map(proposal => <li className="list-group-item list-group-item-success">{proposal.description}</li>)}
                </ul>
            </>
        );
    }
}

export default ProposalList;
