// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;

contract Registration{
    
    event register(address user, bool registered);
    event approve(address user, bool registered);
    
    struct RegistrationDetail {
        uint userId;
        address userAddress;
        bool registered;
    }
    
    address admin;
    uint userAddressCount;
    mapping(uint => RegistrationDetail) public registrationDetails;
    
    modifier permission() {
        require(msg.sender == admin);
        _;
    }
    
    constructor() public{
        admin = msg.sender;
        userAddressCount = 0;
    }
    
    function UserRegister() public {
        require(msg.sender != admin);
        userAddressCount++;
        registrationDetails[userAddressCount] = RegistrationDetail(userAddressCount, msg.sender, false);
        
        emit register(msg.sender, false);
    }
    
    function ApprovedUser(uint _userId) public permission {
        RegistrationDetail storage _registrationDetails = registrationDetails[_userId];
        require(!_registrationDetails.registered, 'Your registration has not been approved!');
        _registrationDetails.registered = true;
        registrationDetails[_userId] = _registrationDetails;

        emit approve(msg.sender, true);
    }
}