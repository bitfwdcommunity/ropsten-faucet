const EthereumTx = require('ethereumjs-tx');

const config = require('./config.js');

const privateKey = config.privateKey;
const key = Buffer.from(privateKey, 'hex');

const txParams = {
  nonce: '0x00',
  gasPrice: '0x2540be400',
  gasLimit: '0x210000',
  to: '0x53358C20E4697DaaFbabb21ea9d7B871c2C91Ac0',
  value: '0x00',
  data: '0x00',
  chainId: 3
}

const tx = new EthereumTx(txParams)
tx.sign(key);
const serializedTx = tx.serialize()
console.log(serializedTx.toString('hex'));
