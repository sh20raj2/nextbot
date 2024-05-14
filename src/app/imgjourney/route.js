
const TelegramBot = require('node-telegram-bot-api');


const token = process.env.IMGJOURNEYBOT;
const bot = new TelegramBot(token);





export const POST = async (req, res, next) => {
    let data = await req.json();
    let manychat = fetch("https://wh.manychat.com/tgwh/tg0o83f4yg73hfgi73f2g89938g/6564625956/3cb9c43b300de42ccc337cc7d8b3e455ceef7d73",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    
    const message = data.message;
    console.log(message);
    const chatId = message.chat.id;
    const textContent = message.text || (message.caption ? message.caption : '');

    bot.on('callback_query', async (callbackQuery) => {
        const message = callbackQuery.message;
        const chatId = message.chat.id;
        const messageId = message.message_id;
        const data = callbackQuery.data;
    
        // Check if the callback data is 'regenerate'
        if (data === 'regenerate') {
            // Send the "Processing" message
            let loaderMessage = await bot.sendMessage(chatId, 'Processing your Image...');
    
            // Fetch new image data
            fetch("https://ask-me-api.vercel.app/api/nft", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: 'prompt' }) // Replace 'prompt' with the actual prompt
            })
            .then(response => response.json())
            .then(data => {
                const base64Data = data.nft_image;
                const imageData = Buffer.from(base64Data, 'base64');
                let captionText = 'Here is your regenerated image! generated by @imgjourneybot\nFrom Prompt :- <a href="#" onclick="document.execCommand(\'copy\'); return false;">prompt</a> \nJoin @sopbots';
                bot.sendPhoto(chatId, imageData, { caption: captionText, parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: 'Regenerate', callback_data: 'regenerate' }]] } }).then(() => {
                    // Image sent, so remove the loader message
                    bot.deleteMessage(chatId, loaderMessage.message_id);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                bot.sendMessage(chatId, 'An error occurred while processing your request');
            });
        }
    });
    
    if (textContent === 'hi') {
        bot.sendMessage(chatId, 'Hello!');
    } else if(textContent == "/start"){
        bot.sendMessage(chatId, "🌟 Welcome to @ImgJourneyBot! 🌟\n\nI'm here to create magical images using prompts. Just send me a prompt, and I'll craft a unique image based on it. Let's embark on an image journey together! 🖼️\n\nJoin @SopBots to request new features or suggest new bots. We're always eager to hear from you! 🚀");
    } else {
        let loaderMessage  = await bot.sendMessage(chatId, 'Processing your Image...');
        bot.sendChatAction(chatId, 'typing');

        fetch("https://ask-me-api.vercel.app/api/nft", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: textContent })
            })
            .then(response => response.json())
            .then(data => {
                const base64Data = data.nft_image; 
                console.log(data);
                const imageData = Buffer.from(base64Data, 'base64');
                let captionText = 'Here is your image! generated by @imgjourneybot\nFrom Prompt :- <a href="#" onclick="document.execCommand(\'copy\'); return false;">'+textContent+'</a> \nJoin @sopbots Share your creation on @sopbotschat and Regenerate  /'+textContent.replaceAll(" ","_")+'' ;
                bot.sendPhoto(chatId, imageData, { caption: captionText, parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: 'Regenerate', callback_data: 'regenerate' }]] } }).then(() => {
                    bot.deleteMessage(chatId, loaderMessage.message_id);
                });
                // bot.sendPhoto(chatId, imageData).then(() => {
                //     // Image sent, so we can hide the loading message
                //     bot.sendMessage(chatId, 'Request processed.');
                // }).catch(error => {
                //     console.error('Error sending image:', error);
                // });
            })
            .catch(error => {
                console.error('Error:', error);
                bot.sendMessage(chatId, 'An error occurred while processing your request');
            });
        // bot.sendMessage(chatId, 'Sorry, I only respond to "hi".');
    }
    
    return Response.json({
        message: 'Message sent successfully'
    });
}







export const GET = async (req, res, next) => {
    console.log(req);
    return Response.json({
        
    })
}
