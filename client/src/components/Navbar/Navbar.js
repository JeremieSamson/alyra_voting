import React, { Component } from 'react'
import CurrentAddress from './CurrentAddress'
import WorkflowStatus from './WorkflowStatus'

class Navbar extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-light bg-light">
                    <a className="navbar-brand" href="#">
                        <img src="logo.png" width="30" height="30"
                             className="d-inline-block align-top" alt=""/>
                            &nbsp;&nbsp;Alyra Voting
                    </a>
                    <WorkflowStatus isOwner={this.props.isOwner} status={this.props.workflowStatus} address={this.props.currentAddress} contract={this.props.contract}/>
                    <CurrentAddress address={this.props.currentAddress} isOwner={this.props.isOwner} voters={this.props.state.voters}/>
                </nav>
            </div>
        );
    }
}

export default Navbar;
