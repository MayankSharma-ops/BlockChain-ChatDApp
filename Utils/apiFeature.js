import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { ChatAppAddress, ChatAppABI } from "../Context/constants";

const HOLESKY_CHAIN_ID = "0x4268";

const switchToHolesky = async () => {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: HOLESKY_CHAIN_ID }],
    });
  } catch (error) {
    // If network not added → add it
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: HOLESKY_CHAIN_ID,
            chainName: "Holesky Testnet",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://holesky.drpc.org"],
            blockExplorerUrls: ["https://eth-holesky.blockscout.com/"],
          },
        ],
      });
    } else {
      console.error(error);
    }
  }
};

export const checkIfWalletConnected = async () => {
  try {
    if (!window.ethereum) return console.log("Please install MetaMask");
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const firstAccount = accounts[0];
    return firstAccount;
  } catch (error) {
    console.log(error);
  }
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) return alert("Install MetaMask");

    await switchToHolesky();

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  } catch (error) {
    console.log(error);
  }
};

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(ChatAppAddress, ChatAppABI, signerOrProvider);

export const connectingWithContract = async () => {
  try {
    await switchToHolesky();

    const web3Modal = new Web3Modal({
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    return contract;
  } catch (error) {
    console.log(error);
  }
};

export const convertTime = (time) => {
  const newTime = new Date(time.toNumber() * 1000);
  const realTime =
    newTime.getHours() +
    ":" +
    newTime.getMinutes() +
    ":" +
    newTime.getSeconds() +
    " " +
    "Date: " +
    newTime.getDate() +
    "/" +
    (newTime.getMonth() + 1) +
    "/" +
    newTime.getFullYear();

  return realTime;
};
