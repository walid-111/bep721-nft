import "dotenv/config";

import hardhatVerify from "@nomicfoundation/hardhat-verify";
import hardhatMocha from "@nomicfoundation/hardhat-mocha";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BSCSCAN_KEY = process.env.BSCSCAN_KEY || "";

export default {
    solidity: "0.8.20",
    defaultNetwork: "node",
    plugins: [hardhatMocha, hardhatEthers, hardhatVerify],
    networks: {
        node: { type: "edr-simulated" },
        bscTestnet: {
            type: "http",
            url: "https://data-seed-prebsc-1-s1.binance.org:8545",
            chainId: 97,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
        },
    },
    verify: {
        etherscan: {
            apiKey: BSCSCAN_KEY,
        },
    },
};