const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying StreamPredict contracts...");

  // Deploy StreamPredict contract
  const StreamPredict = await ethers.getContractFactory("StreamPredict");
  const streamPredict = await StreamPredict.deploy();
  await streamPredict.waitForDeployment();

  const streamPredictAddress = await streamPredict.getAddress();
  console.log("StreamPredict deployed to:", streamPredictAddress);

  // Example: Deploy a streamer token
  const StreamerToken = await ethers.getContractFactory("StreamerToken");
  const streamerToken = await StreamerToken.deploy("NinjaToken", "NINJA", "0x1234567890123456789012345678901234567890");
  await streamerToken.waitForDeployment();

  const streamerTokenAddress = await streamerToken.getAddress();
  console.log("StreamerToken deployed to:", streamerTokenAddress);

  // Save deployment info
  const deploymentInfo = {
    streamPredict: streamPredictAddress,
    streamerToken: streamerTokenAddress,
    network: network.name,
    deployer: (await ethers.getSigners())[0].address,
  };

  console.log("Deployment completed:", deploymentInfo);

  // Verify contracts on Etherscan (for mainnet deployments)
  if (network.name !== "localhost" && network.name !== "hardhat") {
    console.log("Verifying contracts...");
    try {
      await run("verify:verify", {
        address: streamPredictAddress,
        constructorArguments: [],
      });
      console.log("StreamPredict verified");

      await run("verify:verify", {
        address: streamerTokenAddress,
        constructorArguments: ["NinjaToken", "NINJA", "0x1234567890123456789012345678901234567890"],
      });
      console.log("StreamerToken verified");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

