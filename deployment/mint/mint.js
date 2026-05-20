import hre from "hardhat";

const CONTRACT_ADDRESS = "0x5b4cF84157d1596Fe718fF764Ecd3485Cb05cD28";
const TOKEN_URI = "ipfs://bafkreiaj23kn6s2r2v6xxhl4hruebrmqkqt2xnc5ajlvguksktehwt5p3a";
const TOKEN_ID = 1;

async function main() {
    const { ethers } = await hre.network.getOrCreate();

    const [minter] = await ethers.getSigners();
    console.log("Minting with account:", minter.address);

    // Connect to the already deployed contract using its ABI and address
    const NFT42 = await ethers.getContractFactory("NFT42");
    const nft = NFT42.attach(CONTRACT_ADDRESS);

    console.log("Minting NFT #" + TOKEN_ID + "...");
    const tx = await nft.mint(minter.address, TOKEN_ID, TOKEN_URI);
    await tx.wait();

    console.log("NFT minted successfully!");
    console.log("Token ID:  ", TOKEN_ID);
    console.log("Owner:     ", await nft.ownerOf(TOKEN_ID));
    console.log("Token URI: ", await nft.tokenURI(TOKEN_ID));
    console.log("View on BSCScan: https://testnet.bscscan.com/token/" + CONTRACT_ADDRESS + "?a=" + TOKEN_ID);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });