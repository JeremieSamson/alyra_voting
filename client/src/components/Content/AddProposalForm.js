import React, { Component } from 'react'
import { NotificationManager} from 'react-notifications';

class AddProposalForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submittedProposal: ""
        }
    }

    handleInputChanged(event) {
        this.setState({
            submittedProposal: event.target.value
        });
    }

    async handleSubmit() {
        let {contract, currentAddress} = this.props.state;
        const submittedProposal = this.state.submittedProposal;

        try {
            await contract.methods.addProposal(submittedProposal).send({ from: currentAddress });
            NotificationManager.success('Proposal "' +submittedProposal+ '" has been added', 'New proposal', 2000);
        } catch (err) {
            NotificationManager.error('An error occured when adding your proposal', '', 2000);
            console.log(err);
        }
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    Add a proposal
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <label htmlFor="exampleInputAddress">Proposal to register</label>
                        <input type="text"
                               className="form-control"
                               id="exampleInputAddress"
                               placeholder="Enter your proposal"
                               value={this.state.submittedAddress}
                               onChange={this.handleInputChanged.bind(this)}/>
                    </div>
                    <input type="submit" value="Add proposal" onClick={this.handleSubmit.bind(this)}/>
                </div>
            </div>
        );
    }
}

export default AddProposalForm;
