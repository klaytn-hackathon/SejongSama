const PrivateKeyConnector = require('connect-privkey-to-provider')
const NETWORK_ID = '1001'
const GASLIMIT = '20000000'
const URL = `https://api.baobab.klaytn.net:8651`
const PRIVATE_KEY = '0xc22863c5b6952787e5fbe426926d6d98e2d61511fdfa8d4fc487c6a736e7bb20'

module.exports = {
  networks: {  
    klaytn: {
      provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    }
  },
}