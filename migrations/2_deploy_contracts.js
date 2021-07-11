var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var JiraIssueToken = artifacts.require("./JiraIssueToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(JiraIssueToken);
};
