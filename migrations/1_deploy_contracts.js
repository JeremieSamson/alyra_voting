const contract = artifacts.require("Voting");

module.exports = (deployer) => {
    deployer.deploy(contract);
}