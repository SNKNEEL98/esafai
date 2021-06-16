const Consumer = artifacts.require("Consumer");
const Producer = artifacts.require("Producer");
const RI = artifacts.require("RI");

module.exports = function (deployer) {
  deployer.deploy(Consumer);
  deployer.deploy(Producer);
  deployer.deploy(RI);
};
