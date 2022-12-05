// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract SimpleSmartContract {
	string public name;
	function setName(string memory _name) public {
		name = _name;
	}
}


//deploy rede goerli 0x3059F1260795A8457f8Cf426A6cf17D12731DFca