require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { ethers } = require('ethers');

// Завантаження токену та Infura project ID з .env файлу
const token = process.env.TELEGRAM_TOKEN;
const infuraProjectId = process.env.INFURA_PROJECT_ID;

// Провайдер для Ethereum mainnet через Infura
const provider = new ethers.JsonRpcProvider(
	`https://mainnet.infura.io/v3/${infuraProjectId}`
);

const bot = new TelegramBot(token, { polling: true });

let messageIds = [];
let userMessageIds = [];

// Команда /start
bot.onText(/\/start/, msg => {
	const chatId = msg.chat.id;
	bot.sendMessage(
		chatId,
		'Привіт! Використовуйте команду /balance, щоб перевірити баланс вашого гаманця Ethereum за публічним ключем.'
	).then(sentMsg => messageIds.push(sentMsg.message_id));
});

// Команда /balance
bot.onText(/\/balance/, msg => {
	const chatId = msg.chat.id;

	bot.sendMessage(
		chatId,
		'Будь ласка, введіть свій публічний ключ для перевірки балансу.'
	).then(sentMsg => messageIds.push(sentMsg.message_id));

	// Обробляємо наступне повідомлення від користувача для введення публічного ключа
	bot.once('message', async msg => {
		if (msg.text.startsWith('/')) return; // Якщо введена команда, ігноруємо її

		const publicKey = msg.text.trim();
		userMessageIds.push(msg.message_id);

		// Перевірка, чи починається ключ з '0x' і чи правильна його довжина (42 символи)
		if (!publicKey.startsWith('0x') || publicKey.length !== 42) {
			bot.sendMessage(
				chatId,
				'Невірний формат публічного ключа! Переконайтеся, що він починається з "0x" і містить 42 символи.'
			).then(sentMsg => messageIds.push(sentMsg.message_id));
			return;
		}

		try {
			// Отримуємо баланс
			const balance = await provider.getBalance(publicKey);
			const formattedBalance = ethers.formatEther(balance); // Конвертуємо баланс в ETH
			bot.sendMessage(chatId, `Ваш баланс: ${formattedBalance} ETH`).then(
				sentMsg => messageIds.push(sentMsg.message_id)
			);
		} catch (error) {
			// Виводимо деталі помилки в консоль
			console.error('Сталася помилка:', error);

			// Обробляємо конкретні помилки
			if (error.code === 'NETWORK_ERROR') {
				bot.sendMessage(
					chatId,
					'Помилка мережі. Спробуйте пізніше.'
				).then(sentMsg => messageIds.push(sentMsg.message_id));
			} else if (error.code === 'INVALID_ARGUMENT') {
				bot.sendMessage(
					chatId,
					'Невірний публічний ключ. Перевірте ключ і спробуйте ще раз.'
				).then(sentMsg => messageIds.push(sentMsg.message_id));
			} else {
				bot.sendMessage(
					chatId,
					'Сталася невідома помилка. Перевірте свій публічний ключ і спробуйте знову.'
				).then(sentMsg => messageIds.push(sentMsg.message_id));
			}
		}
	});
});

// Команда /clear для очищення повідомлень
bot.onText(/\/clear/, async msg => {
	const chatId = msg.chat.id;

	// Видаляємо повідомлення бота
	for (let messageId of messageIds) {
		try {
			await bot.deleteMessage(chatId, messageId);
		} catch (error) {
			console.error('Помилка при видаленні повідомлення бота:', error);
		}
	}

	// Видаляємо повідомлення користувача
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

	// Повідомлення про очищення
	const sentMsg = await bot.sendMessage(chatId, 'Чат очищено! 🧹');
	setTimeout(() => {
		bot.deleteMessage(chatId, sentMsg.message_id);
	}, 2000);
});
