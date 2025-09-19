import { ethers } from 'ethers';

// Contract ABIs
export const STREAM_PREDICT_ABI = [
  // Prediction management
  "function createPrediction(string prompt, string[] options, uint256 duration) returns (uint256)",
  "function resolvePrediction(uint256 predictionId, string outcome)",
  "function placeWager(uint256 predictionId, string option, uint256 amount)",
  "function claimWinnings(uint256 predictionId)",

  // View functions
  "function getPrediction(uint256 predictionId) view returns (uint256, address, string, string[], uint256, uint256, bool, string, uint256)",
  "function getOptionTotal(uint256 predictionId, string option) view returns (uint256)",
  "function getUserWager(uint256 predictionId, address user, string option) view returns (uint256)",
  "function getStreamerPredictions(address streamer) view returns (uint256[])",
  "function getStreamerToken(address streamer) view returns (address, string, string, bool)",

  // Streamer token management
  "function registerStreamerToken(address tokenAddress, string name, string symbol)",

  // Events
  "event PredictionCreated(uint256 indexed predictionId, address indexed streamer, string prompt)",
  "event WagerPlaced(uint256 indexed predictionId, address indexed user, string option, uint256 amount)",
  "event PredictionResolved(uint256 indexed predictionId, string outcome)",
  "event WinningsClaimed(uint256 indexed predictionId, address indexed user, uint256 amount)",
];

export const STREAMER_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
];

// Contract addresses (these would be deployed addresses)
export const CONTRACT_ADDRESSES = {
  base: {
    streamPredict: process.env.NEXT_PUBLIC_STREAM_PREDICT_ADDRESS || '',
  },
  baseSepolia: {
    streamPredict: process.env.NEXT_PUBLIC_STREAM_PREDICT_ADDRESS_SEPOLIA || '',
  },
};

// Helper functions
export function getStreamPredictContract(signer?: ethers.Signer) {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_RPC_URL);
  const contract = new ethers.Contract(
    CONTRACT_ADDRESSES.base.streamPredict,
    STREAM_PREDICT_ABI,
    signer || provider
  );
  return contract;
}

export function getStreamerTokenContract(tokenAddress: string, signer?: ethers.Signer) {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_RPC_URL);
  const contract = new ethers.Contract(
    tokenAddress,
    STREAMER_TOKEN_ABI,
    signer || provider
  );
  return contract;
}

// Prediction utilities
export async function createPrediction(
  prompt: string,
  options: string[],
  duration: number,
  signer: ethers.Signer
) {
  const contract = getStreamPredictContract(signer);
  const tx = await contract.createPrediction(prompt, options, duration);
  const receipt = await tx.wait();
  return receipt;
}

export async function placeWager(
  predictionId: number,
  option: string,
  amount: string,
  signer: ethers.Signer
) {
  const contract = getStreamPredictContract(signer);
  const tx = await contract.placeWager(predictionId, option, ethers.parseEther(amount));
  const receipt = await tx.wait();
  return receipt;
}

export async function resolvePrediction(
  predictionId: number,
  outcome: string,
  signer: ethers.Signer
) {
  const contract = getStreamPredictContract(signer);
  const tx = await contract.resolvePrediction(predictionId, outcome);
  const receipt = await tx.wait();
  return receipt;
}

export async function claimWinnings(predictionId: number, signer: ethers.Signer) {
  const contract = getStreamPredictContract(signer);
  const tx = await contract.claimWinnings(predictionId);
  const receipt = await tx.wait();
  return receipt;
}

export async function getPrediction(predictionId: number) {
  const contract = getStreamPredictContract();
  const prediction = await contract.getPrediction(predictionId);
  return {
    id: prediction[0],
    streamer: prediction[1],
    prompt: prediction[2],
    options: prediction[3],
    startTime: prediction[4],
    endTime: prediction[5],
    resolved: prediction[6],
    outcome: prediction[7],
    totalWagers: prediction[8],
  };
}

export async function getStreamerToken(streamerAddress: string) {
  const contract = getStreamPredictContract();
  const token = await contract.getStreamerToken(streamerAddress);
  return {
    tokenAddress: token[0],
    name: token[1],
    symbol: token[2],
    isActive: token[3],
  };
}

