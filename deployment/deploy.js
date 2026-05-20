import hre from "hardhat";

async function main() {
    const { ethers } = await hre.network.getOrCreate();

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "BNB");

    const NFT42 = await ethers.getContractFactory("NFT42");
    console.log("Deploying NFT42...");

    const nft = await NFT42.deploy("42ArtHappiToken", "42AHT");
    await nft.waitForDeployment();

    const address = await nft.getAddress();
    console.log("NFT42 deployed to:", address);
    console.log("Network: BSC Testnet (Chain ID 97)");
    console.log("View on BSCScan: https://testnet.bscscan.com/address/" + address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });