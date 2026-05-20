# TokenizeArt

## Contract

- **Network**: BNB Smart Chain Testnet (Chain ID: 97)
- **Contract Address**: 0x5b4cF84157d1596Fe718fF764Ecd3485Cb05cD28
- **Explorer**: https://testnet.bscscan.com/address/0x5b4cF84157d1596Fe718fF764Ecd3485Cb05cD28

## NFT Details

Name : 42ArtHappiToken #1
Collection : 42ArtHappiToken
Symbol : 42AHT
Standard : BEP-721
Token ID : 1
Owner : 0x4dcC4460346A22A63223a5650a4d3AE0b46689E6
Image : https://gateway.pinata.cloud/ipfs/bafkreidj4ztai4nb3xz3ekjkzjsv6hrh5nhz5gaww5fmochbs7rb5g6dua
Metadata : ipfs://bafkreiaj23kn6s2r2v6xxhl4hruebrmqkqt2xnc5ajlvguksktehwt5p3a

## Design Choices

### Why BNB Smart Chain?
Same as the Tokenizer project : Partnership with BNB Chain free testnet etc..

### Why ERC-721?
Token42 used IBEP20 because BNB Chain published an official BEP-20 interface
NFT42 used IERC721 because there is no official IBEP721, BNB Chain just uses ERC-721

### Why IPFS for image and metadata storage?
The subject requires distributed registry technology. IPFS stores files
across thousands of nodes worldwide and makes our image and metadata permanently accessible via their content hash (CID).
Pinata is used as the IPFS service provider.

### Why Hardhat?
Actively maintained, integrates with ethers.js, supports BSCScan verification, and lets us write JS tests.

## Repository Structure

```
.
-> README.md
-> code/
   -> NFT42.sol              <- BEP-721 smart contract
-> deployment/
   -> contracts/
   -> test/
      -> NFT42.test.js
   -> hardhat.config.js      <- framework config
   -> deploy.js
   -> package.json
-> mint/
   -> mint.js                <- script to mint the NFT
-> documentation/
   -> DOCUMENTATION.md
```

## How to Deploy

```bash
cd deployment
npm install
cp .env.example .env
npx hardhat test
npx hardhat run deploy.js --network bscTestnet
npx hardhat run mint/mint.js --network bscTestnet
```