import React, { Component } from "react";
import Voting from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Navbar from './components/Navbar/Navbar'
import Content from "./components/Content/Content";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    proposals: [],
    voters: [],
    votes: [],
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Voting.networks[networkId];
      const instance = new web3.eth.Contract(
          Voting.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
      console.error(error);
    }
  };

  getPastEventsData() {
    let { contract, proposals, voters, votes } = this.state;
    let app = this;

    contract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, eventsData){})
      .then(function(smartContractEvents){
        for(let smartContractEvent of smartContractEvents){
          if (smartContractEvent.event === 'VoterRegistered'){
            voters.push(smartContractEvent.returnValues.voterAddress);
          } else if (smartContractEvent.event === 'ProposalRegistered'){
            proposals.push({
              'proposalId': smartContractEvent.returnValues.proposalId,
              'description': smartContractEvent.returnValues.description
            });
          } else if (smartContractEvent.event === 'Voted'){
            votes.push({
              'voter': smartContractEvent.returnValues.voter,
              'proposalId': smartContractEvent.returnValues.proposalId
            });
          }
        }

        app.setState({
          voters: voters,
          proposals: proposals,
          votes: votes
        });
      });
  }

  runExample = async () => {
    let { contract, accounts } = this.state;

    const workflowStatus = await contract.methods.workflowStatus().call({from: accounts[0]});
    const owner = await contract.methods.owner().call({from: accounts[0]});
    const currentAddress = accounts[0];
    const isOwner = owner === currentAddress;
    const winningProposalId = await contract.methods.winningProposalID().call({from: accounts[0]});

    this.getPastEventsData();

    this.setState({
      workflowStatus: workflowStatus,
      currentAddress: currentAddress,
      isOwner: isOwner,
      winningProposalId: winningProposalId
    });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <Navbar state={this.state} currentAddress={this.state.currentAddress} workflowStatus={this.state.workflowStatus} isOwner={this.state.isOwner} contract={this.state.contract}/>
        <NotificationContainer/>
        <Content state={this.state} workflowStatus={this.state.workflowStatus} isOwner={this.state.isOwner} contract={this.state.contract} currentAddress={this.state.currentAddress}/>
      </div>
    );
  }
}

export default App;
