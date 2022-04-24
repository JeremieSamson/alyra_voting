import React, {Component} from 'react'
import {NotificationManager} from "react-notifications";

class Winner extends Component {
    render() {
        const winningProposal = this.props.state.proposals.find(proposal => proposal.proposalId === this.props.state.winningProposalId);

        return (
            <>
                <div className="card" id="winner-img">
                    <div className="card-header">the winning proposal is</div>
                    <div className="card-body">
                        <p className="card-text">
                            {winningProposal !== undefined && 'description' in winningProposal ? winningProposal.description : ''}
                        </p>
                    </div>
                </div>
            </>
        );
    }
}

export default Winner;
