import React, { Component } from 'react'
import { NotificationManager} from 'react-notifications';

class AddAddressForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submittedAddress: ""
        }
    }

    handleInputChanged(event) {
        this.setState({
            submittedAddress: event.target.value
        });
    }

    async handleSubmit() {
        const contract = this.props.contract;
        const submittedAddress = this.state.submittedAddress;

        try {
            await contract.methods.addVoter(submittedAddress).send({ from: this.props.currentAddress });
            NotificationManager.success('Voter with address "' +submittedAddress+ '" has been added', 'New voter', 2000);
        } catch (err) {
            NotificationManager.error('An error occured when adding voter', '', 2000);
            console.log(err);
        }
    }

    render() {
        if (this.props.workflowStatus === "0") {
            return (
                <div className="card">
                    <div className="card-header">
                        Featured
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="exampleInputAddress">Address to register</label>
                            <input type="text"
                                   className="form-control"
                                   id="exampleInputAddress"
                                   aria-describedby="emailHelp"
                                   placeholder="Enter address"
                                   value={this.state.submittedAddress}
                                   pattern="^0x[a-fA-F0-9]{40}$"
                                   name="address"
                                   onChange={this.handleInputChanged.bind(this)}/>
                            <small id="emailHelp" className="form-text text-muted">Eth address starting with 0x.</small>
                        </div>
                        <input type="submit" value="Add address" onClick={this.handleSubmit.bind(this)}/>
                    </div>
                </div>
            );
        }

        return (
            <div/>
        );
    }
}

export default AddAddressForm;
