# Documentation

## What is an NFT?

A Non-Fungible Token is a unique (unlike regular tokens) digital asset stored on a blockchain.
Each NFT has a unique ID and a single owner. It cannot be replicated or divided.

## Token Details

Collection Name : 42ArtHappiToken
Symbol : 42AHT
Standard : BEP-721 (identical to ERC-721)
Network : BNB Smart Chain Testnet (Chain ID: 97)
Contract Address : 0x5b4cF84157d1596Fe718fF764Ecd3485Cb05cD28
Token ID minted : 1
Owner : 0x4dcC4460346A22A63223a5650a4d3AE0b46689E6

## How it works

### 1. The image
Uploaded a 500x500 PNG containing "42" to IPFS via Pinata : permanently stored at:
```
https://gateway.pinata.cloud/ipfs/bafkreidj4ztai4nb3xz3ekjkzjsv6hrh5nhz5gaww5fmochbs7rb5g6dua
```

### 2. The metadata
A JSON file describing the NFT : name, description, image link, attributes.
```
https://gateway.pinata.cloud/ipfs/bafkreiaj23kn6s2r2v6xxhl4hruebrmqkqt2xnc5ajlvguksktehwt5p3a
```

### 3. The contract
BEP-721 (ERC-721) implementation, deployed once on BSC Testnet. It stores ownership and metadata links for every minted NFT.

### 4. Minting
Calling `mint(address, tokenId, tokenURI)` creates a new unique NFT (protected by `onlyOwner`)

## Key functions

`ownerOf(tokenId)` : Returns who owns a specific NFT
`tokenURI(tokenId)` : Returns the IPFS metadata link for an NFT
`mint(to, tokenId, uri)` : Creates a new NFT (owner only)
`transferFrom(from, to, tokenId)` : Transfers an NFT to another address
`approve(to, tokenId)` : Approves one address to transfer one specific NFT
`setApprovalForAll(operator, bool)` : Approves an operator for all your NFTs
`balanceOf(address)` : How many NFTs this address owns

## What is IPFS?

InterPlanetary File System : a decentralized storage network where files are stored across thousands of nodes worldwide and identified by their content hash (CID).

## Security

- `mint()` restricted to owner via `onlyOwner`
- Transfers blocked to `address(0)`
- Only owner or approved address can transfer an NFT
- Token IDs are unique — cannot mint the same ID twice
- Solidity 0.8.20 automatic overflow protection
- 15 automated tests cover all security cases

## How to prove ownership

On BSCScan -> Read Contract:
- `ownerOf(1)` -> returns the owner address
- `tokenURI(1)` -> returns the IPFS metadata link

## How to run locally

```bash
git clone https://github.com/walid-111/bep721-nft.git
cd bep721-nft/deployment
npm install
cp .env.example .env # add your PRIVATE_KEY and BSCSCAN_KEY
npx hardhat test
```