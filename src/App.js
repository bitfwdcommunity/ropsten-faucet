import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import axios from 'axios';

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

  addNotification(type, response) {
    let action;
    if (type === 'success') {
      action = {
        label: 'View Transaction',
        callback: function() {
          window.open('https://ropsten.etherscan.io/tx/' + response);
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
        if (response === 'IP address temporarily blacklisted.') {
          this.notificationSystem.addNotification({
            message: "You've already taken some ropstens recently, try again in 30 minutes.",
            level: type,
            position: 'bc'
          });
        } else {
          this.notificationSystem.addNotification({
            message: 'Transaction Unsuccessful!',
            level: type,
            position: 'bc'
          });
        }
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
    const url = 'https://toolbox.bitfwd.xyz/api/eth_sendRawTransaction';

    let type = '';
    let response;
    let txHash = '';
    let post_error = false;

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
      post_error = true;
      type = 'error';
      txHash = e.response.data;
    }

    if (!post_error) {
      if (response['data']) {
        type = 'success';
        txHash = response.data;
      }
    }

    this.addNotification(type, txHash);

    this.setState({address: ''});
  }

  render() {
    return (
      <div className="container">
        <div className="container-row">
            <header className="App-header">
              <h1 className="App-title">bitfwd & bokky's ropsten faucet</h1>
            </header>
            <div className="App-text">
              check out <a href="https://www.bitfwd.xyz">bitfwd</a> &amp; <a href="https://github.com/bokkypoobah">bokky</a>! happy developing!
            </div>
            <br />
            <div className="App-text">
              <form className="App-form" onSubmit={this.handleSubmit}>
                <label>
                  address &ensp;
                  <input type="text" value={this.state.address} onChange={this.handleChange} />
                </label>
                &emsp;
                <input type="submit" value="eths pls!" />
              </form>
            </div>
            <NotificationSystem ref="notificationSystem" />
        </div>
      </div>
    );
  }
}

export default App;
