# bot-gpt
ChatGPT in your whatsapp, with your own number!

## Installation
- Clone the repo
- Create .env file (or just remove the .env.example to .env)
- Add the OpenAI API key there and the system message.
- System message can be anything, it is the first prompt chatgpt will listen to, and should be stronger than a normal user prompt. You can put rules there.

## Getting Started

### Local
- From the remote directory, run `node index.js`
- Then it will produce a QR code, connect it to your whatsapp number.
- When finished just close with `shift` and `C`
- Then run `pm2 start index.js`
- Now any message received that starts with `!chat`(and space after) would be answered with a ChatGPT response!

## Keeping it running
- Since it is local, it only runs as long as your computer runs.
- Personally I run `pm2` with cron job restarting it every hour because it has some problems. If you want to do the same, run `pm2 start index.js --cron-restart="0 * * * *"`

## Deploying
- I have no idea how to deploy it, currently it uses persistant db so it is a problem. If any of you want to contribute and find a way to deploy it easily, feel free!

## Security
- OpenAI stores your message, so every message you sent with "!chat" will be remembered

## Customization
- You can replace the default `!chat` command with anything with anything by changing the `trigger` value in `config.yaml`