//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Ownable.sol";

interface tokenRecipient {
    function receiveApproval(
        address _from,
        uint256 _amount,
        address _token,
        bytes calldata _extraData
      ) external;
}

contract ManualToken is Ownable {
    //public variables
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;


    //array of balances
    mapping(address => uint256) public balanceOf;
    //Address mapping A allows address mapping B to use X amount of tokens
    mapping(address => mapping(address => uint256)) public allowance;

    //Events:
    //Blockchain event notifying clients of transfer
    event Transfer(address indexed from, address indexed to, uint256 value);

    //Blockchain event notifying clients of approval
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _amount
    );

    //Blockchain event notifying clients of amount burned
    event Burn(address indexed from, uint256 amount);

    //Initializes contract - initial supply token to the creator
    constructor(
    uint256 initialSupply,
    string memory tokenName,
    string memory tokenSymbol
    ) {
        totalSupply = initialSupply; //total supply w/decimals
        balanceOf[msg.sender] = totalSupply; //all tokens to owner
        name = tokenName;
        symbol = tokenSymbol;
    }

    //internal transfers can only be called by this contract
    function tokenTransfer(address _from, address _to, uint256 _amount) internal {
        require(_to != address(0), "Error: Transfer to genesis account"); //Genesis address - Use burn() instead
        require(_from != address(0), "Error: Transfer from genesis account");
        require(balanceOf[_from] >= _amount); // Does sender have enough
        require(balanceOf[_to] + _amount >= balanceOf[_to]); // Check for overflow

        uint256 previousBalances = balanceOf[_from] + balanceOf[_to]; //use for assertion at the end of block

        balanceOf[_from] -= _amount; //substract from sender
        balanceOf[_to] += _amount; //add to recipient

        emit Transfer(_from, _to, _amount); //emit transaction

        assert(balanceOf[_from] + balanceOf[_to] == previousBalances); //should never fail

    }

    //transfer tokens - send amount of tokens from owner account to recipient's account
    function transfer(address _to, uint256 _amount) public virtual returns (bool success) {
        tokenTransfer(msg.sender, _to , _amount);
        return true;
    }

    //transfer from a different address than owner
    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool success) {
        require(_amount <= allowance[_from][msg.sender]); // Check allowance
        allowance[_from][msg.sender] -= _amount; //subtract from sender balance
        tokenTransfer(_from, _to, _amount);
        return true;
    }

    //Set allowance for spender(authorized address) <= amount
    function approve(address _spender, uint256 _amount) public returns (bool success) {
        allowance[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount); //Emits approval event
        return true;
    }

    //Set allowance for spender(authorized address) <= amount + Notify
    function approveAndCall(
        address _spender,
        uint256 _amount,
        bytes memory _extraData
       ) public returns (bool success) {
        tokenRecipient spender= tokenRecipient(_spender);
        if (approve(_spender, _amount)) {
            spender.receiveApproval(msg.sender, _amount, address(this), _extraData);
            return true;
        }
    }

    // Manual mint function

    function mint(address _to, uint256 _amount) public onlyOwner {
        require(_to != address(0), "ERR: Mint to Genesis account");
        balanceOf[_to] += _amount;
        totalSupply += _amount;
        emit Transfer(address(0), owner, _amount);
        emit Transfer(owner, _to, _amount);
    }

    //Manual burn token
    function burn(uint256 _amount) public onlyOwner returns (bool success){
        require (balanceOf[msg.sender] >= _amount);
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;
        emit Burn(msg.sender, _amount);
        return true;
    }

    function burnFrom(address _from, uint256 _amount) public returns (bool success) {
        require(balanceOf[_from] >= _amount); // Does sender have enough
        require(_amount <= allowance[_from][msg.sender]); // Check allowance
        balanceOf[_from] = balanceOf[_from] - _amount; //substract from sender
        allowance[_from][msg.sender] -= _amount; //subtract from sender allowance
        totalSupply -= _amount; //Update totalSupply
        emit Burn(_from, _amount); //Emit burn event
        return true;
    }
}

