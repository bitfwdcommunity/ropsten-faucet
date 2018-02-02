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
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="row padding-bottom">
              <div className="col">
                <h1>bitfwd's Ethereum<br /><span className="txt-blue">Ropsten Faucet</span></h1>
              </div>
            </div>
            <div className="row padding-bottom">
              <div className="col">
                <h4>Instantly Get Ropsten Ethereum To Experiment On Test Net<span className="txt-blue">.</span></h4>
              </div>
            </div>
            <div className="row padding-bottom">
              <div className="col">
                <ul className="features-list">
                  <li>Community Driven</li>
                  <li>Instant</li>
                  <li>Free</li>
                </ul>
              </div>
            </div>
            <div className="row">
              <form onSubmit={this.handleSubmit} style={{width: "100%"}}>
                <input className="fwd-input" style={{width: "65%", marginRight: "8px"}} placeholder="Your Ethereum Address" type="text" value={this.state.address} onChange={this.handleChange} />
                <input className="fwd-btn" style={{width: "30%"}} type="submit" value="Get ETH!" />
              </form>
              <NotificationSystem ref="notificationSystem" />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="row">
              <div className="col">
                <div className="hspace d-block d-md-none"></div>
                <img className="poweredby" src="/img/bitfwd_pwrd.png" />
              </div>
            </div>
            <div className="row" style={{paddingTop: "50px", paddingBottom: "50px"}}>
              <div className="col">
                <center>A partnership between <a href="https://bitfwd.xyz" target="_blank">bitfwd</a> community and <a href="https://github.com/bokkypoobah" target="_blank">Bokky PooBah</a><span className="txt-blue">!</span></center>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col col-md-10 col-lg-7">
            <div className="row" style={{paddingTop: "40px", paddingBottom: "40px"}}>
              <div className="col">
              <center>
                Do you want to learn how to issue your own ERC20 Token in less than 20 minutes?
                <br />
                <span className="txt-blue">Check this post to learn how to do it:</span>
              </center>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <center><a href="https://medium.com/bitfwd/how-to-issue-your-own-token-on-ethereum-in-less-than-20-minutes-ac1f8f022793" target="_blank" className="fwd-btn" style={{fontSize: "1.4rem", padding: "12px 24px"}}>Learn how to issue your own ERC20 token</a></center>
              </div>
            </div>
            <div className="row" style={{paddingTop: "40px", paddingBottom: "40px"}}>
              <div className="col">
                <center>JOIN BITFWD COMMUNITY TO GET MORE EPIC CRYPTO CONTENT<span className="txt-blue">.</span></center>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <form action="https://xyz.us12.list-manage.com/subscribe/post?u=e305133cac0aefe39c72fb9ea&amp;id=e95f04b163" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                  <input className="fwd-input width100" type="email" name="EMAIL" id="mce-EMAIL" placeholder="Email" required/>
                  <div style={{position: "absolute", left: "-5000px"}} aria-hidden="true"><input type="text" name="b_e305133cac0aefe39c72fb9ea_e95f04b163" tabIndex="-1" value=""/></div>
                  <br />
                  <input type="submit" style={{marginTop: 8}} value="JOIN THE COMMUNITY" name="subscribe" id="mc-embedded-subscribe" className="fwd-btn width100"/>
                </form>
              </div>
            </div>
          </div>
        </div>
        <footer className="row" style={{paddingTop: "40px"}}>
          <div className="col">
            <center><a href="https://t.me/joinchat/EDRmq1Km4zYE-0aQ7SPUng" target="_blank">telegram</a> - <a href="https://twitter.com/bitfwdxyz" target="_blank">twitter</a> - <a href="https://medium.com/bitfwd" target="_blank">medium</a> - <a href="https://www.facebook.com/bitfwd/" target="_blank">facebook</a></center>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
