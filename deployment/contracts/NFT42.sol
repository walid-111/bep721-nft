// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ERC-721 interface — defines the functions every NFT contract must have
interface IERC721 {
    // Emitted when an NFT is transferred between addresses
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    // Emitted when an address is approved to transfer a specific NFT
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    // Emitted when an operator is approved to manage all NFTs of an owner
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    // Returns how many NFTs this address owns
    function balanceOf(address owner) external view returns (uint256);
    // Returns who owns a specific NFT by its ID
    function ownerOf(uint256 tokenId) external view returns (address);
    // Transfers an NFT from one address to another
    function transferFrom(address from, address to, uint256 tokenId) external;
    // Approves an address to transfer a specific NFT
    function approve(address to, uint256 tokenId) external;
    // Returns the approved address for a specific NFT
    function getApproved(uint256 tokenId) external view returns (address);
    // Approves or removes an operator for all of the caller's NFTs
    function setApprovalForAll(address operator, bool approved) external;
    // Returns if an operator is approved to manage all NFTs of an owner
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

// Provides _msgSender() — returns whoever called the current function
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

// Adds an owner address and onlyOwner access control
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Sets the deployer as the initial owner
    constructor() {
        _transferOwnership(_msgSender());
    }

    // Returns the current owner address
    function owner() public view returns (address) {
        return _owner;
    }

    // Blocks the function if caller is not the owner
    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    // Hands ownership to a new address
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    // Permanently removes the owner
    function renounceOwnership() public onlyOwner {
        _transferOwnership(address(0));
    }

    // Internal — updates _owner and emits the event
    function _transferOwnership(address newOwner) internal {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// The actual NFT contract — implements BEP-721 with ownership control
contract NFT42 is Context, IERC721, Ownable {

    // Token name and symbol
    string private _name;
    string private _symbol;

    // Maps each tokenId to its owner address
    mapping(uint256 => address) private _owners;

    // Maps each address to how many NFTs it owns
    mapping(address => uint256) private _balances;

    // Maps each tokenId to the address approved to transfer it
    mapping(uint256 => address) private _tokenApprovals;

    // Maps owner => operator => approved for all
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Maps each tokenId to its metadata URI (IPFS link)
    mapping(uint256 => string) private _tokenURIs;

    // Sets token name and symbol at deployment
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _transferOwnership(_msgSender());
    }

    // Returns the token name
    function name() public view returns (string memory) {
        return _name;
    }

    // Returns the token symbol
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    // Returns how many NFTs this address owns
    function balanceOf(address owner) public view override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _balances[owner];
    }

    // Returns who owns a specific NFT — key function for proving ownership
    function ownerOf(uint256 tokenId) public view override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }

    // Returns the metadata URI for a specific NFT — points to IPFS JSON
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "ERC721: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    // Approves an address to transfer a specific NFT
    function approve(address to, uint256 tokenId) public override {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");
        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "ERC721: approve caller is not owner nor approved for all");
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    // Returns the approved address for a specific NFT
    function getApproved(uint256 tokenId) public view override returns (address) {
        require(_owners[tokenId] != address(0), "ERC721: approved query for nonexistent token");
        return _tokenApprovals[tokenId];
    }

    // Approves or removes an operator for all of the caller's NFTs
    function setApprovalForAll(address operator, bool approved) public override {
        require(operator != _msgSender(), "ERC721: approve to caller");
        _operatorApprovals[_msgSender()][operator] = approved;
        emit ApprovalForAll(_msgSender(), operator, approved);
    }

    // Returns if an operator is approved to manage all NFTs of an owner
    function isApprovedForAll(address owner, address operator) public view override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    // Transfers an NFT from one address to another
    function transferFrom(address from, address to, uint256 tokenId) public override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _transfer(from, to, tokenId);
    }

    // Creates a new unique NFT and assigns it to `to` — only owner can mint
    function mint(address to, uint256 tokenId, string memory uri) public onlyOwner {
        require(to != address(0), "ERC721: mint to the zero address");
        require(_owners[tokenId] == address(0), "ERC721: token already minted");
        _balances[to] += 1;
        _owners[tokenId] = to;
        _tokenURIs[tokenId] = uri;
        emit Transfer(address(0), to, tokenId);
    }

    // Internal — checks if an address is the owner or approved to transfer
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner ||
                getApproved(tokenId) == spender ||
                isApprovedForAll(owner, spender));
    }

    // Internal — transfers an NFT, updates balances and owner mapping
    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");
        _tokenApprovals[tokenId] = address(0);
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(from, to, tokenId);
    }
}