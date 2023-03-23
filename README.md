# bot-gpt
ChatGPT in your whatsapp, with your own number!

Installation
- Clone the repo
- Create .env file (or just remove the .env.example to .env)
- Add the OpenAI API key there and the system message.

## Getting Started

### Local
- From the remote directory, run `node index.js`
- Then it will produce a QR code, connect it to your whatsapp number.
- When finished just close with `shift` and `C`
- Then run `pm2 start index.js`
- Now any message received that starts with "!chat" would be answered with a ChatGPT response!