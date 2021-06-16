const Consumer = artifacts.require("./Consumer.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract("Consumer", ([deployer, consumer, buyer]) => {
  let contracts

  before(async () => {
    contracts = await Consumer.deployed()
  })

  describe("deployment", async () => {
    it("You are the Consumer", async () => {
      const address = await contracts.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, "")
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe("ewastes", async () => {
    let result, EwasteCount

    before(async () => {
      result = await contracts.createEwaste("Mi", web3.utils.toWei("1", "Ether"), "This is Mi phone", { from: consumer })

      EwasteCount = await contracts.EwasteCount()
    })

    it("Requesting for E-waste", async () => {
      assert.equal(EwasteCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), EwasteCount.toNumber(), "id is correct")
      assert.equal(event.name, "Mi", "name is correct")
      assert.equal(event.price, "1000000000000000000", "price is correct")
      assert.equal(event.description, "This is Mi phone", "description is correct")
      assert.equal(event.owner, consumer, "owner is correct")
      assert.equal(event.approved, false, "approved is correct")
      assert.equal(event.purchased, false, "purchased is correct")

      await await contracts.createEwaste("", web3.utils.toWei("1", "Ether"), { from: consumer }).should.be.rejected;

      await await contracts.createEwaste("Mi", 0, { from: consumer }).should.be.rejected;
    })

    it("Lists of E-wastes", async () => {
      const ewaste = await contracts.ewastes(EwasteCount)
      assert.equal(ewaste.id.toNumber(), EwasteCount.toNumber(), "id is correct")
      assert.equal(ewaste.name, "Mi", "name is correct")
      assert.equal(ewaste.price, "1000000000000000000", "price is correct")
      assert.equal(ewaste.description, "This is Mi phone", "description is correct")
      assert.equal(ewaste.owner, consumer, "owner is correct")
      assert.equal(ewaste.approved, false, "approved is correct")
      assert.equal(ewaste.purchased, false, "purchased is correct")
    })

    it("Approval of E-wastes", async () => {

      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), EwasteCount.toNumber(), "id is correct")
      assert.equal(event.name, "Mi", "name is correct")
      assert.equal(event.description, "This is Mi phone", "description is correct")
      assert.equal(event.owner, consumer, "owner is correct")
      assert.equal(event.approved, false, "approved is correct")
      assert.equal(event.purchased, false, "purchased is correct")
    })

    it('Purchases of E-wastes', async () => {
      let OldSellerBalance
      OldSellerBalance = await web3.eth.getBalance(consumer)
      OldSellerBalance = new web3.utils.BN(OldSellerBalance)

      result = await contracts.purchaseEwaste(EwasteCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') })

      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), EwasteCount.toNumber(), "id is correct")
      assert.equal(event.name, "Mi", "name is correct")
      assert.equal(event.price, "1000000000000000000", "price is correct")
      assert.equal(event.description, "This is Mi phone", "description is correct")
      assert.equal(event.owner, buyer, "owner is correct")
      assert.equal(event.approved, true, "approved is correct")
      assert.equal(event.purchased, true, "purchased is correct")

      let NewSellerBalance
      NewSellerBalance = await web3.eth.getBalance(consumer)
      NewSellerBalance = new web3.utils.BN(NewSellerBalance)

      let price
      price = web3.utils.toWei('1', 'Ether')
      price = new web3.utils.BN(price)

      const Balance = OldSellerBalance.add(price)

      assert.equal(NewSellerBalance.toString(), Balance.toString())

      await contracts.purchaseEwaste(99, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;

      await contracts.purchaseEwaste(EwasteCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;

      await contracts.purchaseEwaste(EwasteCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;

      await contracts.purchaseEwaste(EwasteCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    })
  })
})
