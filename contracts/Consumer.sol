// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;

contract Consumer {
    string public name;
    address private admin;
    uint256 public EwasteCount = 0;
    mapping(uint256 => Ewaste) public ewastes;

    struct Ewaste {
        uint256 id;
        string name;
        uint256 price;
        string description;
        address payable owner;
        bool approved;
        bool purchased;
    }

    event EwasteCreated(
        uint256 id,
        string name,
        uint256 price,
        string description,
        address payable owner,
        bool approved,
        bool purchased
    );

    event ApprovedEwaste(
        uint256 id,
        string name,
        string description,
        address owner,
        bool approved,
        bool purchased
    );

    event EwastePurchased(
        uint256 id,
        string name,
        uint256 price,
        string description,
        address payable owner,
        bool approved,
        bool purchased
    );

    constructor() public {
        admin = msg.sender;
        name = "Welcome in E-SAFAI Portal";
    }

    modifier adminrights() {
        require(msg.sender != admin);
        _;
    }

    function createEwaste(
        string memory _name,
        uint256 _price,
        string memory _description
    ) public adminrights {
        // Valid name
        require(bytes(_name).length > 0);
        // Valid price
        require(_price > 0);
        // Valid description
        require(bytes(_description).length > 0);
        // Increment eproduct count
        EwasteCount++;
        // Create the eproducts
        ewastes[EwasteCount] = Ewaste(
            EwasteCount,
            _name,
            _price,
            _description,
            msg.sender,
            false,
            false
        );

        emit EwasteCreated(
            EwasteCount,
            _name,
            _price,
            _description,
            msg.sender,
            false,
            false
        );
    }

    function approveEwaste(uint256 _id) public adminrights {
        // Fetch the eproduct
        Ewaste memory _ewaste = ewastes[_id];
        // The eproduct has not been approved already
        require(!_ewaste.approved);
        // approved
        _ewaste.approved = true;
        // Update the eproduct
        ewastes[_id] = _ewaste;

        emit ApprovedEwaste(
            _ewaste.id,
            _ewaste.name,
            _ewaste.description,
            msg.sender,
            true,
            false
        );
    }

    function purchaseEwaste(uint256 _id) public payable adminrights {
        // Fetch the eproduct
        Ewaste memory _ewaste = ewastes[_id];
        // Fetch the owner
        address payable _seller = _ewaste.owner;
        // Make sure the product has a valid id
        require(_ewaste.id > 0 && _ewaste.id <= EwasteCount);
        // There is enough Ether in the transaction
        require(msg.value >= _ewaste.price);
        // The eproduct has not been purchased already
        require(!_ewaste.purchased);
        // The buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to the approver
        _ewaste.owner = msg.sender;
        // purchased
        _ewaste.purchased = true;
        // Update the eproduct
        ewastes[_id] = _ewaste;
        // Pay the seller
        address(_seller).transfer(msg.value);

        emit EwastePurchased(
            EwasteCount,
            _ewaste.name,
            _ewaste.price,
            _ewaste.description,
            msg.sender,
            true,
            true
        );
    }
}
