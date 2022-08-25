const networkConfig = {
  default: {
    name: "hardhat",
  },

  31337: {
    name: "localhost",
  },

  5: {
    name: "goerli",
    linkToken: "0x326c977e6efc84e512bb9c30f76e30c160ed06fb",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    fundAmount: "0",
  },
}

const INITIAL_SUPPLY = "10000000000000000000000000"
const TOKEN_NAME = "Tokenator"
const TOKEN_SYMBOL = "TOK"

const developmentChains = ["hardhat", "localhost"]

module.exports = {
  networkConfig,
  developmentChains,
  TOKEN_NAME,
  TOKEN_SYMBOL,
  INITIAL_SUPPLY,
}
