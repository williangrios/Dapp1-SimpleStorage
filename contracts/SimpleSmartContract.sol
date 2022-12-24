// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract SimpleSmartContract {
	string public name;
	function setName(string memory _name) public {
		name = _name;
	}
}
