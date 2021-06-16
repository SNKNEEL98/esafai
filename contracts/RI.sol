// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;

contract RI {
    string public name;
    address private admin;
    uint256 public RecycledEwasteCount = 0;
    mapping(uint256 => RecycledEwaste) public recycledewastes;

    struct RecycledEwaste {
        uint256 id;
        string name;
        uint256 price;
        string description;
        address payable owner;
        bool approved;
        bool purchased;
    }

    event RequestsRecycledEwaste(
        uint256 id,
        string name,
        uint256 price,
        string description,
        address payable owner,
        bool approved,
        bool purchased
    );

    event ApprovedRecycledEwaste(
        uint256 id,
        string name,
        string description,
        address owner,
        bool approved,
        bool purchased
    );

    event PurchasedRecycledEwaste(
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

    function RequestRecycledEwaste(
        string memory _name,
        uint256 _price,
        string memory _description
    ) public {
        // Valid name
        // Valid price
        require(bytes(_name).length > 0);
        require(_price > 0);
        // Valid description
        require(bytes(_description).length > 0);
        // Increment eproduct count
        RecycledEwasteCount++;
        // Create the eproducts
        recycledewastes[RecycledEwasteCount] = RecycledEwaste(
            RecycledEwasteCount,
            _name,
            _price,
            _description,
            msg.sender,
            false,
            false
        );

        emit RequestsRecycledEwaste(
            RecycledEwasteCount,
            _name,
            _price,
            _description,
            msg.sender,
            false,
            false
        );
    }

    function approveRecycledEwaste(uint256 _id) public {
        // Fetch the eproduct
        RecycledEwaste memory _recycledewaste = recycledewastes[_id];
        // The eproduct has not been approved already
        require(!_recycledewaste.approved);
        // approved
        _recycledewaste.approved = true;
        // Update the eproduct
        recycledewastes[_id] = _recycledewaste;

        emit ApprovedRecycledEwaste(
            _recycledewaste.id,
            _recycledewaste.name,
            _recycledewaste.description,
            msg.sender,
            true,
            false
        );
    }

    function purchaseRecycledEwaste(uint256 _id) public payable {
        // Fetch the eproduct
        RecycledEwaste memory _recycledewaste = recycledewastes[_id];
        // Fetch the owner
        address payable _seller = _recycledewaste.owner;
        // Make sure the product has a valid id
        require(
            _recycledewaste.id > 0 && _recycledewaste.id <= RecycledEwasteCount
        );
        // There is enough Ether in the transaction
        require(msg.value >= _recycledewaste.price);
        // The eproduct has not been purchased already
        require(!_recycledewaste.purchased);
        // The buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to the approver
        _recycledewaste.owner = msg.sender;
        // purchased
        _recycledewaste.purchased = true;
        // Update the eproduct
        recycledewastes[_id] = _recycledewaste;
        // Pay the seller
        address(_seller).transfer(msg.value);

        emit PurchasedRecycledEwaste(
            RecycledEwasteCount,
            _recycledewaste.name,
            _recycledewaste.price,
            _recycledewaste.description,
            msg.sender,
            true,
            true
        );
    }
}
