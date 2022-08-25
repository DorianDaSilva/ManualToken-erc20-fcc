const { network } = require("hardhat")
const {
    developmentChains,
    INITIAL_SUPPLY,
    TOKEN_NAME,
    TOKEN_SYMBOL,
} = require("../helper-hardhat-config")
const { verify } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const args = [INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL]

    const token = await deploy("ManualToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`token deployed at ${token.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(token.address, args)
    }
}

module.exports.tags = ["all", "token"]
