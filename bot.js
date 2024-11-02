const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your bot token from BotFather
const token = '7840358046:AAGWcBhRPtvq171KnTxFKjuP4LIrvHkYH5g';
const bot = new TelegramBot(token, { polling: true });

// Listen for the /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello! I am your bot. Send me a Codeforces handle to get the maximum score.');
});

// Listen for any text messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    // Check if the message is a handle (not a command)
    if (!msg.text.startsWith('/')) {
        const handle = msg.text.trim();

        try {
            console.log(`Fetching data for handle: ${handle}`); // Debugging log

            // Fetch user contest results
            const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
            const data = response.data;

            if (data.status === 'OK' && data.result.length > 0) {
                // Extract maximum score
                const maxScore = Math.max(...data.result.map(contest => contest.newRating || 0));
                bot.sendMessage(chatId, `User: ${handle}\nMaximum Score: ${maxScore}`);
            } else {
                console.log('User not found or no data returned.'); // Debugging log
                bot.sendMessage(chatId, 'User not found or no rating data available. Please check the handle and try again.');
            }
        } catch (error) {
            console.error('Error fetching data:', error); // Log the error for debugging
            bot.sendMessage(chatId, 'Error fetching data. Please try again later.');
        }
    }
});
