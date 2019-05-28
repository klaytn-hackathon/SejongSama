const BeggarBetting = artifacts.require('./BeggarBetting.sol')
const fs = require('fs')

module.exports = function (deployer) {
  deployer.deploy(BeggarBetting)
    .then(() => {
      if (BeggarBetting._json) {
        fs.writeFile(
          'deployedABI',
          JSON.stringify(BeggarBetting._json.abi),
          (err) => {
            if (err) throw err
            console.log("파일에 ABI 입력 성공");
          })
      }

      fs.writeFile(
        'deployedAddress',
        BeggarBetting.address,
        (err) => {
          if (err) throw err
          console.log("파일에 주소 입력 성공");
        })
    })
}