// NFT42 tests : Mocha (runner) + Chai (assertions) + Hardhat (blockchain)
// beforeEach deploys a fresh contract before every test
// ethers.getSigners() returns 20 fake wallets pre-loaded with test BNB

import { expect } from "chai";
import hre from "hardhat";

describe("NFT42", function () {
    let nft;
    let owner;
    let addr1;
    let addr2;
    let ethers;

    const TOKEN_URI = "ipfs://bafkreiaj23kn6s2r2v6xxhl4hruebrmqkqt2xnc5ajlvguksktehwt5p3a";

    beforeEach(async function () {
        ({ ethers } = await hre.network.getOrCreate());
        [owner, addr1, addr2] = await ethers.getSigners();
        const NFT42 = await ethers.getContractFactory("NFT42");
        nft = await NFT42.deploy("42ArtToken", "42ART");
        await nft.waitForDeployment();
    });

    describe("Deployment", function () {
        it("should set the correct name", async function () {
            expect(await nft.name()).to.equal("42ArtToken");
        });

        it("should set the correct symbol", async function () {
            expect(await nft.symbol()).to.equal("42ART");
        });

        it("should set the deployer as owner", async function () {
            expect(await nft.owner()).to.equal(owner.address);
        });
    });

    describe("Minting", function () {
        it("should mint an NFT to an address", async function () {
            await nft.connect(owner).mint(addr1.address, 1, TOKEN_URI);
            expect(await nft.ownerOf(1)).to.equal(addr1.address);
        });

        it("should increase balance after mint", async function () {
            await nft.connect(owner).mint(addr1.address, 1, TOKEN_URI);
            expect(await nft.balanceOf(addr1.address)).to.equal(1n);
        });

        it("should set the correct tokenURI", async function () {
            await nft.connect(owner).mint(addr1.address, 1, TOKEN_URI);
            expect(await nft.tokenURI(1)).to.equal(TOKEN_URI);
        });

        it("should fail if non-owner tries to mint", async function () {
            try {
                await nft.connect(addr1).mint(addr1.address, 1, TOKEN_URI);
                expect.fail("should have reverted");
            } catch (e) {
                expect(e.message).to.include("Ownable: caller is not the owner");
            }
        });

        it("should fail if token already minted", async function () {
            await nft.connect(owner).mint(addr1.address, 1, TOKEN_URI);
            try {
                await nft.connect(owner).mint(addr2.address, 1, TOKEN_URI);
                expect.fail("should have reverted");
            } catch (e) {
                expect(e.message).to.include("ERC721: token already minted");
            }
        });
    });

    describe("Transfers", function () {
        it("should transfer an NFT to another address", async function () {
            await nft.connect(owner).mint(addr1.address, 1, TOKEN_URI);
            await nft.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
        });

        it("should update balances after transfer", async function () {
            await nft.connect(owner).mint(addr1.address, 1, TOKEN_URI);
            await nft.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
            expect(await nft.balanceOf(addr1.address)).to.equal(0n);
            expect(await nft.balanceOf(addr2.address)).to.equal(1n);
        });

        it("should fail if non-owner tries to transfer", async function () {
            await nft.connect(owner).mint(addr1.address, 1, TOKEN_URI);
            try {
                await nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1);
                expect.fail("should have reverted");
            } catch (e) {
                expect(e.message).to.include("ERC721: transfer caller is not owner nor approved");
            }
        });
    });

    describe("Approvals", function () {
        it("should approve an address to transfer an NFT", async function () {
            await nft.connect(owner).mint(addr1.address, 1, TOKEN_URI);
            await nft.connect(addr1).approve(addr2.address, 1);
            expect(await nft.getApproved(1)).to.equal(addr2.address);
        });

        it("should allow approved address to transfer", async function () {
            await nft.connect(owner).mint(addr1.address, 1, TOKEN_URI);
            await nft.connect(addr1).approve(addr2.address, 1);
            await nft.connect(addr2).transferFrom(addr1.address, addr2.address, 1);
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
        });
    });

    describe("Ownership", function () {
        it("should transfer ownership", async function () {
            await nft.connect(owner).transferOwnership(addr1.address);
            expect(await nft.owner()).to.equal(addr1.address);
        });

        it("should fail if non-owner transfers ownership", async function () {
            try {
                await nft.connect(addr1).transferOwnership(addr2.address);
                expect.fail("should have reverted");
            } catch (e) {
                expect(e.message).to.include("Ownable: caller is not the owner");
            }
        });
    });
});