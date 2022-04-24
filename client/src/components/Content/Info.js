import React, { Component } from 'react'

class Info extends Component {
    render() {
        return <div className="alert alert-primary" role="alert">{this.props.infoMessage}</div>;
    }
}

export default Info;
