const EthereumTx = require('ethereumjs-tx');
const express = require('express');
const axios = require('axios');

const config = require('./config.js');

const app = express();

const privateKey = config.privateKey;
const key = Buffer.from(privateKey, 'hex');
const url = 'https://ropsten.infura.io/';

// Axios request interceptor
// axios.interceptors.request.use(request => {
//   console.log(request);
//   return request;
// });

// get nonce in future using 'getTransactionCount'
// Generate raw tx
function generateTx(nonce) {
  const txParams = {
    nonce: nonce,
    gasPrice: '0x2540be400',
    gasLimit: '0x210000',
    to: '0x53358C20E4697DaaFbabb21ea9d7B871c2C91Ac0',
    value: '0x00',
    data: '0x00',
    chainId: 3
  }

  const tx = new EthereumTx(txParams)
  tx.sign(key);
  const serializedTx = tx.serialize();
  return serializedTx.toString('hex');
}

// Make id same as nonce for simplicity
app.get('/', async (req, res) => {
  let response;
  try {
    response = await axios({
      method: 'POST',
      url: url,
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_getTransactionCount",
        "params": ["0xe17F97b518E9E8bBC9b72Ab88fd3f9db10BeA981", "latest"]
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500);
  }
  const txCount = response.data.result;

  const rawTx = "0x" + generateTx(txCount);
  const params = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_sendRawTransaction",
    "params": [rawTx]
  };

  try {
    response = await axios({
      method: 'POST',
      url: url,
      headers: {
        "Content-Type": "application/json"
      },
      data: params
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500);
  }
  if (response.status != 200) return res.status(500);

  res.send(response.data.result);
})

app.listen(3000, () => {
  console.log('Ropsten faucet listening on port 3000');
})
