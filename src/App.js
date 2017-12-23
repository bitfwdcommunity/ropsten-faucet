import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import axios from 'axios';

// import 'react-notifications/lib/notifications.css';
import './App.css';

// TODO: Notification showing tx hash

class App extends Component {
  constructor() {
    super();
    this.state = {address: ''};
    this.notificationSystem = null;

    this.addNotification = this.addNotification.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem;
  }

  addNotification(type, txHash) {
    let action;
    if (type === 'success') {
      action = {
        label: 'View Transaction',
        callback: function() {
          window.open('https://ropsten.etherscan.io/tx/' + txHash);
        }
      }
    }
    switch(type) {
      case 'success':
        this.notificationSystem.addNotification({
          message: 'Transaction Successful!',
          level: type,
          position: 'bc',
          action: action
        });
        break;
      case 'error':
        this.notificationSystem.addNotification({
          message: 'Transaction Unsuccessful!',
          level: type,
          position: 'bc'
        });
        break;
      default:
        break;
    }
  }

  handleChange(e) {
    this.setState({address: e.target.value});
  }

  async handleSubmit(e) {
    e.preventDefault();
    let address = this.state.address;
    const url = 'http://localhost:3001/api/eth_sendRawTransaction';

    let type = 'error';
    let response;
    let txHash = '';

    try {
      response = await axios({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          address: address,
        })
      })
    } catch(e) {
      console.log(e);
    }

    if (response['data']) {
      type = 'success';
      txHash = response.data;
    }

    this.addNotification(type, txHash);

    this.setState({address: ''});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">bitfwd ropsten faucet</h1>
        </header>
        <div className="App-text">
          Hi! Welcome to the bitfwd ropsten faucet! We are a community of individuals
          from the Asia Pacific that are interested in supporting the Ethereum ecosystem.
          You can checkout the stuff we have done <a href="https://www.bitfwd.xyz">here</a>.
          We will dispense 3 ETHs each time. There'll be a cooldown period of an hour.
          If you need more Ropsten ETHs, you are welcome to come back for more later.
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Address:
              <input type="text" value={this.state.address} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Send Me Ethers!" />
          </form>
        </div>
        <NotificationSystem ref="notificationSystem" />
      </div>
    );
  }
}

export default App;
