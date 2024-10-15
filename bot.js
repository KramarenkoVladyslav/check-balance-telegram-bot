require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { ethers } = require('ethers');

const token = process.env.TELEGRAM_TOKEN;
const infuraProjectId = process.env.INFURA_PROJECT_ID;

const provider = new ethers.JsonRpcProvider(
	`https://mainnet.infura.io/v3/${infuraProjectId}`
);

const bot = new TelegramBot(token, { polling: true });

let messageIds = []; 
let userMessageIds = []; 


bot.onText(/\/start/, msg => {
	const chatId = msg.chat.id;
	bot.sendMessage(
		chatId,
		'Привіт! Використовуйте команду /balance, щоб перевірити баланс вашого гаманця Ethereum за публічним ключем.'
	).then(sentMsg => messageIds.push(sentMsg.message_id)); 
});

bot.onText(/\/balance/, msg => {
	const chatId = msg.chat.id;

	bot.sendMessage(
		chatId,
		'Будь ласка, введіть свій публічний ключ для перевірки балансу.'
	).then(sentMsg => messageIds.push(sentMsg.message_id)); 

	bot.once('message', async msg => {
		if (msg.text.startsWith('/')) return; 

		const publicKey = msg.text.trim();
		userMessageIds.push(msg.message_id); 

		if (!publicKey.startsWith('0x')) {
			bot.sendMessage(
				chatId,
				'Невірний формат публічного ключа! Ключ має починатися з "0x".'
			).then(sentMsg => messageIds.push(sentMsg.message_id)); 
			return;
		}

		try {
			const balance = await provider.getBalance(publicKey);
			const formattedBalance = ethers.formatEther(balance);
			bot.sendMessage(chatId, `Ваш баланс: ${formattedBalance} ETH`).then(
				sentMsg => messageIds.push(sentMsg.message_id)
			);
		} catch (error) {
			console.error('Сталася помилка:', error);
			bot.sendMessage(
				chatId,
				'Помилка при перевірці балансу. Перевірте свій публічний ключ і спробуйте знову.'
			).then(sentMsg => messageIds.push(sentMsg.message_id)); 
		}
	});
});

bot.onText(/\/clear/, async msg => {
	const chatId = msg.chat.id;

	for (let messageId of messageIds) {
		try {
			await bot.deleteMessage(chatId, messageId);
		} catch (error) {
			console.error('Помилка при видаленні повідомлення бота:', error);
		}
	}

	for (let messageId of userMessageIds) {
		try {
			await bot.deleteMessage(chatId, messageId);
		} catch (error) {
			console.error(
				'Помилка при видаленні повідомлення користувача:',
				error
			);
		}
	}
	messageIds = [];
	userMessageIds = [];

	const sentMsg = await bot.sendMessage(chatId, 'Чат очищено! 🧹');
	setTimeout(() => {
		bot.deleteMessage(chatId, sentMsg.message_id);
	}, 2000);
});
