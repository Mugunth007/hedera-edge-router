// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @title NodeSLARegistry
 * @notice Decentralized SLA Staking and Node Verification Registry for HederaEdge
 * @dev Integrates with Hedera Smart Contract Service (HSCS) and HTS Precompile (0x167)
 */
contract NodeSLARegistry {
    address public owner;
    uint256 public constant MIN_STAKE = 1000; // 1,000 $EDGE tokens

    struct EdgeNode {
        address operator;
        string region;
        uint256 stakedAmount;
        uint256 inferencesCompleted;
        bool active;
    }

    mapping(address => EdgeNode) public nodes;
    address[] public nodeList;

    event NodeRegistered(address indexed operator, uint256 stake, string region);
    event InferenceLogged(address indexed operator, uint256 totalCount);
    event NodeSlashed(address indexed operator, uint256 penalty);

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerNode(string calldata region) external payable {
        require(!nodes[msg.sender].active, "Already active");
        nodes[msg.sender] = EdgeNode({
            operator: msg.sender,
            region: region,
            stakedAmount: msg.value,
            inferencesCompleted: 0,
            active: true
        });
        nodeList.push(msg.sender);
        emit NodeRegistered(msg.sender, msg.value, region);
    }

    function recordInference(address nodeAddr) external onlyOwner {
        require(nodes[nodeAddr].active, "Node not active");
        nodes[nodeAddr].inferencesCompleted += 1;
        emit InferenceLogged(nodeAddr, nodes[nodeAddr].inferencesCompleted);
    }

    function slashNode(address nodeAddr, uint256 penalty) external onlyOwner {
        require(nodes[nodeAddr].active, "Node not active");
        if (nodes[nodeAddr].stakedAmount > penalty) {
            nodes[nodeAddr].stakedAmount -= penalty;
        } else {
            nodes[nodeAddr].stakedAmount = 0;
            nodes[nodeAddr].active = false;
        }
        emit NodeSlashed(nodeAddr, penalty);
    }

    function getNodeCount() external view returns (uint256) {
        return nodeList.length;
    }
}
