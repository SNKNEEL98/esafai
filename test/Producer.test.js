const Producer = artifacts.require("./Producer.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should()

contract("Producer", ([deployer, consumer, buyer]) => {
  let Producercontracts

  before(async () => {
    Producercontracts = await Producer.deployed()
  })

  describe("deployment", async () => {
    it("You are the Producer", async () => {
      const address = await Producercontracts.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, "")
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe("eproducts", async () => {
    let result, EproductCount

    before(async () => {
      result = await Producercontracts.createEproduct("Realme 6 Pro", web3.utils.toWei("2", "Ether"), "This realme phone", { from: buyer })

      EproductCount = await Producercontracts.EproductCount()
    })

    it("Creates E-Products", async () => {
      assert.equal(EproductCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), EproductCount.toNumber(), "id is correct")
      assert.equal(event.name, "Realme 6 Pro", "name is correct")
      assert.equal(event.price, "2000000000000000000", "price is correct")
      assert.equal(event.description, "This realme phone", "description is correct")
      assert.equal(event.owner, buyer, "owner is correct")
      assert.equal(event.approved, false, "approved is correct")
      assert.equal(event.purchased, false, "purchased is correct")

      await await Producercontracts.createEproduct("", web3.utils.toWei("2", "Ether"), { from: buyer }).should.be.rejected;

      await await Producercontracts.createEproduct("Realme 6 Pro", 0, { from: buyer }).should.be.rejected;
    })

    it("Lists of E-Wastes/E-Products", async () => {
      const eproduct = await Producercontracts.eproducts(EproductCount)
      assert.equal(eproduct.id.toNumber(), EproductCount.toNumber(), "id is correct")
      assert.equal(eproduct.name, "Realme 6 Pro", "name is correct")
      assert.equal(eproduct.price, "2000000000000000000", "price is correct")
      assert.equal(eproduct.description, "This realme phone", "description is correct")
      assert.equal(eproduct.owner, buyer, "owner is correct")
      assert.equal(eproduct.approved, false, "approved is correct")
      assert.equal(eproduct.purchased, false, "purchased is correct")
    })

    it("Approved E-waste/E-Products", async () => {

      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), EproductCount.toNumber(), "id is correct")
      assert.equal(event.name, "Realme 6 Pro", "name is correct")
      assert.equal(event.description, "This realme phone", "description is correct")
      assert.equal(event.owner, buyer, "owner is correct")
      assert.equal(event.approved, false, "approved is correct")
      assert.equal(event.purchased, false, "purchased is correct")
    })

    it('Purchased E-Wastes/E-Products', async () => {
      let OldSellerBalance
      OldSellerBalance = await web3.eth.getBalance(buyer)
      OldSellerBalance = new web3.utils.BN(OldSellerBalance)

      result = await Producercontracts.purchaseEproduct(EproductCount, { from: consumer, value: web3.utils.toWei('2', 'Ether') })

      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), EproductCount.toNumber(), "id is correct")
      assert.equal(event.name, "Realme 6 Pro", "name is correct")
      assert.equal(event.price, "2000000000000000000", "price is correct")
      assert.equal(event.description, "This realme phone", "description is correct")
      assert.equal(event.owner, consumer, "owner is correct")
      assert.equal(event.approved, true, "approved is correct")
      assert.equal(event.purchased, true, "purchased is correct")

      let NewSellerBalance
      NewSellerBalance = await web3.eth.getBalance(buyer)
      NewSellerBalance = new web3.utils.BN(NewSellerBalance)

      let price
      price = web3.utils.toWei('2', 'Ether')
      price = new web3.utils.BN(price)

      const Balance = OldSellerBalance.add(price)

      assert.equal(NewSellerBalance.toString(), Balance.toString())

      await Producercontracts.purchaseEproduct(99, { from: consumer, value: web3.utils.toWei('2', 'Ether') }).should.be.rejected;

      await Producercontracts.purchaseEproduct(EproductCount, { from: consumer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;

      await Producercontracts.purchaseEproduct(EproductCount, { from: deployer, value: web3.utils.toWei('2', 'Ether') }).should.be.rejected;

      await Producercontracts.purchaseEproduct(EproductCount, { from: consumer, value: web3.utils.toWei('2', 'Ether') }).should.be.rejected;
    })
  })
})
