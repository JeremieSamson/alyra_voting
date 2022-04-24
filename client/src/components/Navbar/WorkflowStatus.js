import React, { Component } from 'react'

class WorkflowStatus extends Component {
    async handleClick() {
        switch (this.props.status) {
            case "0":
                await this.props.contract.methods.startProposalsRegistering().send({ from: this.props.address });
                break;
            case "1":
                await this.props.contract.methods.endProposalsRegistering().send({from: this.props.address});
                break;
            case "2":
                await this.props.contract.methods.startVotingSession().send({from: this.props.address});
                break;
            case "3":
                await this.props.contract.methods.endVotingSession().send({from: this.props.address});
                break;
            case "4":
                await this.props.contract.methods.tallyVotes().send({from: this.props.address});
                break;
        }

        window.location.reload();
    }

    getStringWorkflow() {
        let statusString = "";

        switch (this.props.status) {
            case "0":
                statusString = "Registering voters";
                break;
            case "1":
                statusString = "Proposals Registration started";
                break;
            case "2":
                statusString = "Proposals Registration ended";
                break;
            case "3":
                statusString = "Voting session started";
                break;
            case "4":
                statusString = "Voting session ended";
                break;
            case "5":
                statusString = "Vote tallied";
                break;
            default:
                statusString = "We can't get the workflow status";
        }

        return statusString;
    }

    getButtonLabel() {
        let labelButton = "";

        switch (this.props.status) {
            case "0":
            case "1":
            case "2":
            case "3":
                labelButton = "Next step";
                break;
            case "4":
                labelButton = "Tally";
                break;
        }

        return labelButton;
    }

    render() {
        if (this.props.isOwner) {
            return (
                <>
                    <div className="mr-sm-2">
                        <span>Current status: {this.getStringWorkflow()}</span><br/>
                        {this.props.status < "5" ? <button onClick={this.handleClick.bind(this)} className="btn btn-success">{this.getButtonLabel()}</button> : ''}
                    </div>
                </>
            );
        }

        return <div className="mr-sm-2"><span>Current status: {this.getStringWorkflow()}</span></div>;
    }
}

export default WorkflowStatus;
