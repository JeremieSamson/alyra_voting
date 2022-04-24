import React, { Component } from 'react'

class CurrentAddress extends Component {
    render() {
        this.text = "";

        if (this.props.address === undefined) {
            this.text = "You are not connected";
        }else if (this.props.isOwner === true) {
            this.text = "Hello owner";
        }else if (this.props.voters.includes(this.props.address)) {
            this.text = "Hello voter";
        }else {
            this.text = "Hello";
        }

        return (
            <span className="mr-sm-2">{this.text} {this.props.address}</span>
        );
    }
}

export default CurrentAddress;
