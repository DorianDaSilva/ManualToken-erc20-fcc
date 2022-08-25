const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers } = require("hardhat")
const {
    INITIAL_SUPPLY,
} = require("../helper-hardhat-config")
const { BN, constants, expectEvent, expectRevert } = require("@openzeppelin/test-helpers")

describe("ManualToken Unit Test", function () {
    const multiplier = 10 ** 18 //Set proper decimals (18)
    let token, deployer, user1

    beforeEach(async function () {
        const accounts = await getNamedAccounts()
        deployer = accounts.deployer
        user1 = accounts.user1
        await deployments.fixture("all")
        token = await ethers.getContract("ManualToken", deployer)
    })

    it("Token deployed!!!", async function () {
        assert(token.address)
    })

    describe("constructor", async function () {
        it("Has correct initial supply of our token", async function () {
            const totalSupply = await token.totalSupply()
            assert.equal(totalSupply.toString(), INITIAL_SUPPLY)
        })

        it("initilize token with the proper name & symbol", async function () {
            const name = (await token.name()).toString()
            assert.equal(name, "Tokenator")
            const symbol = (await token.symbol()).toString()
            assert.equal = (symbol, "TOK")
        })
    })

    describe("minting token", function () {
        it("user1 cannot mint", async function () {
            try {
                await token.mint(deployer, INITIAL_SUPPLY)
                assert(false)
            } catch (e) {
                assert(e)
            }
        })
    })

    describe("transfer", function () {
        it("Should transfer tokens succesfully to desired address", async function () {
            const transferTokens = ethers.utils.parseEther("10")
            await token.transfer(user1, transferTokens)
            expect(await token.balanceOf(user1)).to.equal(transferTokens)
        })
        it("emits a transfer event, when transfer happens", async function () {
            await expect(
                await token.transfer(user1, (10 * multiplier).toString())
            ).to.emit(token, "Transfer")
        })
    })

    describe("allowance", function () {
        const amount = (20 * multiplier).toString()
        beforeEach(async function () {
            newToken = await ethers.getContract("ManualToken", user1)
        })

        it("It should approve other address to spend token", async function () {
            tokenTransfer = ethers.utils.parseEther("5")
            await token.approve(user1, tokenTransfer)
            const userConnectedContract = await ethers.getContract(
                "ManualToken",
                user1
            )
            await token.connect(user1)
            await userConnectedContract.transferFrom(
                deployer,
                user1,
                tokenTransfer
            )
            expect(await userConnectedContract.balanceOf(user1)).to.equal(
                tokenTransfer
            )
        })

        it("doesn't allow a non approved member to transfer", async function () {
            await expect(
                newToken.transferFrom(deployer, user1, amount)
            ).to.be.reverted //("Error: User not approved") //Only 20 token allowed
        })

        it("it emits approval event when transaction is approved", async function () {
            await expect(token.approve(user1, amount)).to.emit(
                token,
                "Approval"
            )
        })

        it("confirms allowance is being set properly", async function () {
            await token.approve(user1, amount)
            const allowance = await token.allowance(deployer, user1)
            assert.equal = (allowance.toString(), amount)
        })

        it("Prevent user from going over the allowance", async function () {
            await token.approve(user1, amount)
            await expect(
                newToken.transferFrom(
                    deployer,
                    user1,
                    (40 * multiplier).toString()
                )
            ).to.be.reverted //With("ERROR: insufficient allowance")
        })
    })
})
