# 🧠 Decentralized Blockchain Chat DApp

> A production-grade peer-to-peer messaging platform built on Ethereum using smart contracts — no servers, no databases, fully decentralized.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Built With](https://img.shields.io/badge/Built%20With-Solidity%20%7C%20Next.js-orange)
![Web3](https://img.shields.io/badge/Web3-Ethereum-purple)

---

## 🌐 Live Demo

🔗 Live App: https://chat-dapp-live.netlify.app/

---

## 🚀 Project Overview

This project demonstrates a complete end-to-end Web3 application where users communicate directly through blockchain transactions.

Unlike traditional chat apps that rely on centralized servers, this system stores relationships and messages on-chain, ensuring:

- 🔐 Trustless communication  
- 🌐 Censorship resistance  
- 🧾 Immutable message history  
- 👛 Uses wallet-based identity
- Generates deterministic conversation IDs  
- Enforces mutual friend authorization  

Designed to showcase real-world smart contract architecture + modern Web3 frontend engineering.

---

## ✨ Core Features

### 🔐 Wallet-Based Authentication
- MetaMask login (no email/password)
- On-chain account initialization
- Address-based identity system
- Multi-network compatibility (Holesky / Sepolia)

---

### 👥 Friend Request System (On-Chain Social Layer)
- Send friend requests via public wallet address
- Accept / reject request workflow
- Mutual friendship enforcement at contract level
- Pending request tracking
- Prevent duplicate friend relationships
- Deterministic relationship mapping

---

### 💬 Messaging System
- Peer-to-peer blockchain messaging
- Deterministic chat channels
- Immutable message storage
- Timestamped conversations
- Real-time UI updates
- Sender/receiver message alignment

---

### 🖥️ Frontend Experience
- Responsive mobile-first design
- Modern chat interface
- Message alignment (sender vs receiver)
- Attachment picker UI
- Dismissible error handling
- Optimized re-render performance

---

### ⛓️ Blockchain Integration
- Smart contract-controlled state
- Gas-efficient data structures
- Multi-network support
- Holesky / Sepolia compatible

---

## 🏗️ Architecture
User (MetaMask)
│
▼
Frontend (Next.js + React)
│
▼
Ethers.js / Web3Modal
│
▼
Smart Contract (Solidity)
│
▼
Ethereum Network(Mainnet/Testnet)

---


## ⚙️ Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/MayankSharma-ops/BlockChain-ChatDApp.git
cd chatapp
```
### 2️⃣ Install Dependencies

```bash
npm install
```
### 3️⃣ Run Development Server

```bash
npm run dev
```
=======
---

## 🛠 Smart Contract Development (Hardhat)

```bash
npx hardhat help
npx hardhat compile
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/deploy.js
```

---

# 👨‍💻 Author
**Mayank Sharma**
💼 Web3 / Full-Stack Developer
🐙 GitHub: https://github.com/MayankSharma-ops
---

# BlockChain-ChatDApp
>>>>>>> 0x5FbDB2315678afecb367f032d93F642f64180aa3

## 📜 License

MIT License
