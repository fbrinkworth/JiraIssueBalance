var JiraIssueToken = artifacts.require("./JiraIssueToken.sol");

module.exports = function(deployer) {
  deployer.deploy(JiraIssueToken);
};
