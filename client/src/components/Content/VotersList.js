import React, { Component } from 'react'
import Info from "./Info";

class VotersList extends Component {
    render() {
        if (this.props.voters.length === 0) {
            return <Info infoMessage="There is no voters yet"/>;
        }

        return (
            <>
                <h1>List of voters</h1>
                <ul className="list-group">
                    {this.props.voters.map(voter => <li className="list-group-item list-group-item-success">{voter}</li>)}
                </ul>
            </>
        );
    }
}

export default VotersList;
