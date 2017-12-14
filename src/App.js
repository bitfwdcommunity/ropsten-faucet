import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

// TODO: Websocket with array queue
// TODO: Notification showing tx hash

class App extends Component {
  constructor() {
    super();
    this.state = {address: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({address: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    let address = this.state.address;
    const url = 'http://localhost:3000/api/eth_sendRawTransaction';

    axios({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        address: address,
      })
    }, (err, resp) => {
      console.log(resp);
      console.log('submitted!');
    });

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
        <form onSubmit={this.handleSubmit}>
          <label>
            Address:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Send Me Ethers!" />
        </form>
      </div>
    );
  }
}

export default App;
