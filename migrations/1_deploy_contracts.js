const ResumeContract = artifacts.require("ResumeContract");

module.exports = function (deployer) {
  deployer.deploy(ResumeContract);
};
