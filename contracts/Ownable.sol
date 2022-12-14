//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Ownable {
    address public owner;

    constructor () {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "NotOwner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        owner = newOwner;
    }
}