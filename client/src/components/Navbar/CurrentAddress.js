import React, { Component } from 'react'

class CurrentAddress extends Component {
    render() {
        let {isOwner, currentAddress, voters} = this.props.state;

        this.text = "";

        if (currentAddress === undefined) {
            this.text = "You are not connected";
        }else if (isOwner === true) {
            this.text = "Hello owner";
        }else if (voters.includes(currentAddress)) {
            this.text = "Hello voter";
        }else {
            this.text = "Hello";
        }

        return (
            <span className="mr-sm-2">{this.text} {currentAddress}</span>
        );
    }
}

export default CurrentAddress;
