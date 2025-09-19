// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract StreamPredict is Ownable, ReentrancyGuard {
    struct Prediction {
        uint256 id;
        address streamer;
        string prompt;
        string[] options;
        uint256 startTime;
        uint256 endTime;
        bool resolved;
        string outcome;
        uint256 totalWagers;
        mapping(string => uint256) optionTotals;
        mapping(address => mapping(string => uint256)) userWagers;
        mapping(address => bool) hasClaimed;
    }

    struct StreamerToken {
        address tokenAddress;
        string name;
        string symbol;
        bool isActive;
    }

    mapping(uint256 => Prediction) public predictions;
    mapping(address => StreamerToken) public streamerTokens;
    mapping(address => uint256[]) public streamerPredictions;

    uint256 public predictionCount;
    uint256 public constant FEE_PERCENTAGE = 5; // 5% platform fee

    event PredictionCreated(uint256 indexed predictionId, address indexed streamer, string prompt);
    event WagerPlaced(uint256 indexed predictionId, address indexed user, string option, uint256 amount);
    event PredictionResolved(uint256 indexed predictionId, string outcome);
    event WinningsClaimed(uint256 indexed predictionId, address indexed user, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function registerStreamerToken(
        address tokenAddress,
        string memory name,
        string memory symbol
    ) external {
        require(tokenAddress != address(0), "Invalid token address");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");

        streamerTokens[msg.sender] = StreamerToken({
            tokenAddress: tokenAddress,
            name: name,
            symbol: symbol,
            isActive: true
        });
    }

    function createPrediction(
        string memory prompt,
        string[] memory options,
        uint256 duration
    ) external returns (uint256) {
        require(bytes(prompt).length > 0, "Prompt cannot be empty");
        require(options.length >= 2 && options.length <= 10, "Must have 2-10 options");
        require(duration > 0 && duration <= 7 days, "Duration must be 1 second to 7 days");

        predictionCount++;
        uint256 predictionId = predictionCount;

        Prediction storage prediction = predictions[predictionId];
        prediction.id = predictionId;
        prediction.streamer = msg.sender;
        prediction.prompt = prompt;
        prediction.options = options;
        prediction.startTime = block.timestamp;
        prediction.endTime = block.timestamp + duration;
        prediction.resolved = false;
        prediction.totalWagers = 0;

        streamerPredictions[msg.sender].push(predictionId);

        emit PredictionCreated(predictionId, msg.sender, prompt);
        return predictionId;
    }

    function placeWager(uint256 predictionId, string memory option, uint256 amount) external nonReentrant {
        Prediction storage prediction = predictions[predictionId];
        require(prediction.id != 0, "Prediction does not exist");
        require(block.timestamp >= prediction.startTime, "Prediction has not started");
        require(block.timestamp < prediction.endTime, "Prediction has ended");
        require(!prediction.resolved, "Prediction already resolved");
        require(amount > 0, "Amount must be greater than 0");

        // Check if option is valid
        bool validOption = false;
        for (uint256 i = 0; i < prediction.options.length; i++) {
            if (keccak256(bytes(prediction.options[i])) == keccak256(bytes(option))) {
                validOption = true;
                break;
            }
        }
        require(validOption, "Invalid option");

        // Get streamer token
        StreamerToken memory token = streamerTokens[prediction.streamer];
        require(token.isActive, "Streamer token not active");

        // Transfer tokens from user to contract
        IERC20(token.tokenAddress).transferFrom(msg.sender, address(this), amount);

        // Update prediction data
        prediction.optionTotals[option] += amount;
        prediction.userWagers[msg.sender][option] += amount;
        prediction.totalWagers += amount;

        emit WagerPlaced(predictionId, msg.sender, option, amount);
    }

    function resolvePrediction(uint256 predictionId, string memory outcome) external {
        Prediction storage prediction = predictions[predictionId];
        require(prediction.id != 0, "Prediction does not exist");
        require(msg.sender == prediction.streamer || msg.sender == owner(), "Only streamer or owner can resolve");
        require(block.timestamp >= prediction.endTime, "Prediction has not ended yet");
        require(!prediction.resolved, "Prediction already resolved");

        // Check if outcome is valid
        bool validOutcome = false;
        for (uint256 i = 0; i < prediction.options.length; i++) {
            if (keccak256(bytes(prediction.options[i])) == keccak256(bytes(outcome))) {
                validOutcome = true;
                break;
            }
        }
        require(validOutcome, "Invalid outcome");

        prediction.resolved = true;
        prediction.outcome = outcome;

        emit PredictionResolved(predictionId, outcome);
    }

    function claimWinnings(uint256 predictionId) external nonReentrant {
        Prediction storage prediction = predictions[predictionId];
        require(prediction.id != 0, "Prediction does not exist");
        require(prediction.resolved, "Prediction not resolved");
        require(!prediction.hasClaimed[msg.sender], "Already claimed winnings");

        uint256 userWager = prediction.userWagers[msg.sender][prediction.outcome];
        require(userWager > 0, "No winnings to claim");

        uint256 winningOptionTotal = prediction.optionTotals[prediction.outcome];
        uint256 totalPool = prediction.totalWagers;

        // Calculate winnings: (user's wager / winning option total) * total pool
        uint256 winnings = (userWager * totalPool) / winningOptionTotal;

        // Deduct platform fee
        uint256 fee = (winnings * FEE_PERCENTAGE) / 100;
        uint256 netWinnings = winnings - fee;

        // Mark as claimed
        prediction.hasClaimed[msg.sender] = true;

        // Get streamer token and transfer winnings
        StreamerToken memory token = streamerTokens[prediction.streamer];
        IERC20(token.tokenAddress).transfer(msg.sender, netWinnings);

        emit WinningsClaimed(predictionId, msg.sender, netWinnings);
    }

    function getPrediction(uint256 predictionId) external view returns (
        uint256 id,
        address streamer,
        string memory prompt,
        string[] memory options,
        uint256 startTime,
        uint256 endTime,
        bool resolved,
        string memory outcome,
        uint256 totalWagers
    ) {
        Prediction storage prediction = predictions[predictionId];
        require(prediction.id != 0, "Prediction does not exist");

        return (
            prediction.id,
            prediction.streamer,
            prediction.prompt,
            prediction.options,
            prediction.startTime,
            prediction.endTime,
            prediction.resolved,
            prediction.outcome,
            prediction.totalWagers
        );
    }

    function getOptionTotal(uint256 predictionId, string memory option) external view returns (uint256) {
        return predictions[predictionId].optionTotals[option];
    }

    function getUserWager(uint256 predictionId, address user, string memory option) external view returns (uint256) {
        return predictions[predictionId].userWagers[user][option];
    }

    function getStreamerPredictions(address streamer) external view returns (uint256[] memory) {
        return streamerPredictions[streamer];
    }

    function getStreamerToken(address streamer) external view returns (
        address tokenAddress,
        string memory name,
        string memory symbol,
        bool isActive
    ) {
        StreamerToken memory token = streamerTokens[streamer];
        return (token.tokenAddress, token.name, token.symbol, token.isActive);
    }

    // Emergency functions
    function emergencyWithdraw(address tokenAddress, uint256 amount) external onlyOwner {
        IERC20(tokenAddress).transfer(owner(), amount);
    }

    function setStreamerTokenActive(address streamer, bool active) external onlyOwner {
        streamerTokens[streamer].isActive = active;
    }
}

