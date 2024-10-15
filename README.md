
# Ethereum Wallet Balance Checker Telegram Bot

## Overview

**Ethereum Wallet Balance Checker Telegram Bot** is a simple yet powerful tool that allows users to check the balance of any Ethereum wallet using its public address. By utilizing the Telegram API and Ethereum blockchain, the bot retrieves wallet balances securely and quickly. It's easy to use and deploy, making it a great solution for those who want to keep track of Ethereum wallets.

[Try it out here!](https://t.me/ITECHIE_BOT)

---

## Features

- **Check Ethereum Wallet Balance:** Users can provide any public Ethereum address to retrieve the wallet's balance.
- **Telegram Integration:** Easily accessible via a Telegram bot, with simple commands to interact with.
- **Secure:** The bot only requires a public Ethereum address—no private keys are involved, ensuring the safety and privacy of users.
- **Live Deployment on Heroku:** The bot is live and available for immediate use, deployed on Heroku for continuous operation.
- **Customizable & Extendable:** Easily modify and extend the bot with new functionalities, thanks to modular code structure.

---

## Technologies Used

- **Node.js** for server-side logic.
- **Telegram API** for bot interaction.
- **Web3.js** for communication with the Ethereum blockchain.
- **Heroku** for deployment.
- **Hardhat** for blockchain development environment.

---

## Getting Started

### Prerequisites

Before setting up the bot locally, ensure you have the following installed:

- **Node.js** (https://nodejs.org/)
- **Telegram Bot Token** (Register via [BotFather](https://core.telegram.org/bots#botfather))
- **Infura API URL** or access to an Ethereum node ([Infura](https://infura.io/))

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KramarenkoVladyslav/check-balance-telegram-bot.git
   cd check-balance-telegram-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory with the following configuration:
   ```bash
   TELEGRAM_TOKEN=your-telegram-bot-token
   INFURA_API_URL=https://mainnet.infura.io/v3/your-infura-project-id
   ```

4. **Run the bot locally:**
   ```bash
   npm start
   ```

---

### Usage

Once the bot is up and running:

1. **Find the bot on Telegram:** [ITECHIE_BOT](https://t.me/ITECHIE_BOT).
2. **Interaction process:**
   - When you press "Start", the bot will greet you: 
     - `Привіт! Використовуйте команду /balance, щоб перевірити баланс вашого гаманця Ethereum за публічним ключем.`
   - The bot will then ask: 
     - `Будь ласка, введіть свій публічний ключ для перевірки балансу.`
   - After you enter your public key, the bot will respond with:
     - `Ваш баланс: 1.2834 ETH`

---

## Contact

Developed by **[Kramarenko Vladyslav](https://github.com/KramarenkoVladyslav)**

- Telegram Bot: [ITECHIE_BOT](https://t.me/ITECHIE_BOT)

