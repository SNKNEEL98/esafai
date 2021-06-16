// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;

contract Producer {
    string public name;
    address private admin;
    uint256 public EproductCount = 0;
    mapping(uint256 => Eproduct) public eproducts;

    struct Eproduct {
        uint256 id;
        string name;
        uint256 price;
        string description;
        address payable owner;
        bool approved;
        bool purchased;
    }

    event EproductCreated(
        uint256 id,
        string name,
        uint256 price,
        string description,
        address payable owner,
        bool approved,
        bool purchased
    );

    event ApprovedEproduct(
        uint256 id,
        string name,
        string description,
        address owner,
        bool approved,
        bool purchased
    );

    event EproductPurchased(
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

    function createEproduct(
        string memory _name,
        uint256 _price,
        string memory _description
    ) public {
        // Valid name
        require(bytes(_name).length > 0);
        // Valid price
        require(_price > 0);
        // Valid description
        require(bytes(_description).length > 0);
        // Increment eproduct count
        EproductCount++;
        // Create the eproducts
        eproducts[EproductCount] = Eproduct(
            EproductCount,
            _name,
            _price,
            _description,
            msg.sender,
            false,
            false
        );

        emit EproductCreated(
            EproductCount,
            _name,
            _price,
            _description,
            msg.sender,
            false,
            false
        );
    }

    function approveEproduct(uint256 _id) public {
        // Fetch the eproduct
        Eproduct memory _eproduct = eproducts[_id];
        // The eproduct has not been approved already
        require(!_eproduct.approved);
        // approved
        _eproduct.approved = true;
        // Update the eproduct
        eproducts[_id] = _eproduct;

        emit ApprovedEproduct(
            _eproduct.id,
            _eproduct.name,
            _eproduct.description,
            msg.sender,
            true,
            false
        );
    }

    function purchaseEproduct(uint256 _id) public payable {
        // Fetch the eproduct
        Eproduct memory _eproduct = eproducts[_id];
        // Fetch the owner
        address payable _seller = _eproduct.owner;
        // Make sure the product has a valid id
        require(_eproduct.id > 0 && _eproduct.id <= EproductCount);
        // There is enough Ether in the transaction
        require(msg.value >= _eproduct.price);
        // The eproduct has not been purchased already
        require(!_eproduct.purchased);
        // The buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to the approver
        _eproduct.owner = msg.sender;
        // purchased
        _eproduct.purchased = true;
        // Update the eproduct
        eproducts[_id] = _eproduct;
        // Pay the seller
        address(_seller).transfer(msg.value);

        emit EproductPurchased(
            EproductCount,
            _eproduct.name,
            _eproduct.price,
            _eproduct.description,
            msg.sender,
            true,
            true
        );
    }
}
