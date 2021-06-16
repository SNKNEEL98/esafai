const RI = artifacts.require("./RI.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract("RI", ([deployer, buyer, ri]) => {
  let RIcontracts

  before(async () => {
    RIcontracts = await RI.deployed()
  })

  describe("deployment", async () => {
    it("You are the Recycling Industry", async () => {
      const address = await RIcontracts.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, "")
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe("Recycled E-waste", async () => {
    let result, RecycledEwasteCount

    before(async () => {
      result = await RIcontracts.RequestRecycledEwaste("Redmi note 4", web3.utils.toWei("1", "Ether"), "This is redmi note 4 phone", { from: ri })

      RecycledEwasteCount = await RIcontracts.RecycledEwasteCount()
    })

    it("Requests for Recycled E-Waste", async () => {
      assert.equal(RecycledEwasteCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), RecycledEwasteCount.toNumber(), "id is correct")
      assert.equal(event.name, "Redmi note 4", "name is correct")
      assert.equal(event.price, "1000000000000000000", "price is correct")
      assert.equal(event.description, "This is redmi note 4 phone", "description is correct")
      assert.equal(event.owner, ri, "owner is correct")
      assert.equal(event.approved, false, "approved is correct")
      assert.equal(event.purchased, false, "purchased is correct")

      await await RIcontracts.RequestRecycledEwaste("", web3.utils.toWei("1", "Ether"), { from: ri }).should.be.rejected;

      await await RIcontracts.RequestRecycledEwaste("Redmi note 4", 0, { from: ri }).should.be.rejected;
    })

    it("Approved RecycledE-waste", async () => {

      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), RecycledEwasteCount.toNumber(), "id is correct")
      assert.equal(event.name, "Redmi note 4", "name is correct")
      assert.equal(event.description, "This is redmi note 4 phone", "description is correct")
      assert.equal(event.owner, ri, "owner is correct")
      assert.equal(event.approved, false, "approved is correct")
      assert.equal(event.purchased, false, "purchased is correct")
    })

    it('Purchased RecycledE-waste', async () => {
      let OldSellerBalance
      OldSellerBalance = await web3.eth.getBalance(ri)
      OldSellerBalance = new web3.utils.BN(OldSellerBalance)

      result = await RIcontracts.purchaseRecycledEwaste(RecycledEwasteCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') })

      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), RecycledEwasteCount.toNumber(), "id is correct")
      assert.equal(event.name, "Redmi note 4", "name is correct")
      assert.equal(event.price, "1000000000000000000", "price is correct")
      assert.equal(event.description, "This is redmi note 4 phone", "description is correct")
      assert.equal(event.owner, buyer, "owner is correct")
      assert.equal(event.approved, true, "approved is correct")
      assert.equal(event.purchased, true, "purchased is correct")

      let NewSellerBalance
      NewSellerBalance = await web3.eth.getBalance(ri)
      NewSellerBalance = new web3.utils.BN(NewSellerBalance)

      let price
      price = web3.utils.toWei('1', 'Ether')
      price = new web3.utils.BN(price)

      const Balance = OldSellerBalance.add(price)

      assert.equal(NewSellerBalance.toString(), Balance.toString())

      await RIcontracts.purchaseRecycledEwaste(99, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;

      await RIcontracts.purchaseRecycledEwaste(RecycledEwasteCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;

      await RIcontracts.purchaseRecycledEwaste(RecycledEwasteCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;

      await RIcontracts.purchaseRecycledEwaste(RecycledEwasteCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    })
  })
})
