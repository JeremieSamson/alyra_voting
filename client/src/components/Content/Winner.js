import React, {Component} from 'react'

class Winner extends Component {
    render() {
        let {proposals, winningProposalId} = this.props.state;

        const winningProposal = proposals.find(proposal => proposal.proposalId === winningProposalId);

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
