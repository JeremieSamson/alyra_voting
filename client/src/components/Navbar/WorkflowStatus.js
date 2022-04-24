import React, { Component } from 'react'

class WorkflowStatus extends Component {
    async handleClick() {
        let {workflowStatus, contract, currentAddress} = this.props.state;

        switch (workflowStatus) {
            case "0":
                await contract.methods.startProposalsRegistering().send({ from: currentAddress });
                break;
            case "1":
                await contract.methods.endProposalsRegistering().send({from: currentAddress });
                break;
            case "2":
                await contract.methods.startVotingSession().send({from: currentAddress });
                break;
            case "3":
                await contract.methods.endVotingSession().send({from: currentAddress });
                break;
            case "4":
                await contract.methods.tallyVotes().send({from: currentAddress });
                break;
        }

        window.location.reload();
    }

    getStringWorkflow() {
        let {workflowStatus} = this.props.state;
        let statusString = "";

        switch (workflowStatus) {
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
        let {workflowStatus} = this.props.state;
        let labelButton = "";

        switch (workflowStatus) {
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
        let {workflowStatus, isOwner} = this.props.state;

        if (isOwner) {
            return (
                <>
                    <div className="mr-sm-2">
                        <span>Current status: {this.getStringWorkflow()}</span><br/>
                        {workflowStatus < "5" ? <button onClick={this.handleClick.bind(this)} className="btn btn-success">{this.getButtonLabel()}</button> : ''}
                    </div>
                </>
            );
        }

        return <div className="mr-sm-2"><span>Current status: {this.getStringWorkflow()}</span></div>;
    }
}

export default WorkflowStatus;
