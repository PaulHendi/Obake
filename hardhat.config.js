require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "fantom_testnet",
  networks: {
    fantom: {
      url: "https://rpc.ankr.com/fantom",
      accounts: [process.env.PRIVATE_KEY]
    },
    fantom_testnet: {
      url: "https://rpc.ankr.com/fantom_testnet",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  mocha: {
    timeout: 100000
  }
};
