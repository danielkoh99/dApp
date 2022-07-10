// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "dApp Token farm";
    DaiToken public daiToken;
    DappToken public dappToken;
    address public owner;
    mapping(address => uint256) public stakingBalance;

    mapping(address => bool) public hasStaked;

    mapping(address => bool) public isStaking;

    address[] public stakers;

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        daiToken = _daiToken;
        dappToken = _dappToken;
        owner = msg.sender;
    }

    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "amount cannot be 0");
        // transfer mock dai to contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // stake tokens
    function issueTokens() public {
        require(msg.sender == owner, "caller must be owner");

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }

    // unstake tokens

    function unstakeTokens() public {
        require(msg.sender != owner, "caller must not be owner");
        uint256 balance = stakingBalance[msg.sender];
        daiToken.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }
    // issueing tokens
}
