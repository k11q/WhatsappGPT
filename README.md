<p align="center">
<img src="https://raw.githubusercontent.com/khairulhaaziq/whatsappgpt/main/whatsapp-gpt.png" alt="WhatsappGPT - ChatGPT in your whatsapp" width="250">
<br>
WhatsappGPT
<br>
ChatGPT in your whatsapp, with your own phone number!
</p>

## Installation
1. Clone the repo

## Getting Started

### Local
1. First, you need to setup OpenAI API and put a system message.
- If you don't have an OpenAI account, create it first [here](https://auth0.openai.com/u/signup), then create a key [here](https://platform.openai.com/overview).
2. Add OpenAI API key and the system message in the .env file.
-  System message can be anything, it is the first prompt chatgpt will listen to, we use it to setup how the AI chat should behave. You can put rules there.
3. Then, you need to setup your whatsapp client. From the remote directory, run `npm run setup`
4. Wait for it to produce a QR code, connect it to your whatsapp number.
5. When it logs `Client is ready!`, close with `shift` and `C`
6. Then run `npm run start`
7. You are done with the setup! Now any message received that starts with `!chat`(and space after) would be answered with a ChatGPT response!

## Usage

> **Note**
> Right now error handling via the API call isn't working. Don't mad at me.

> **Warning**
> Caution with sharing your number connected to this. Incase somebody spam your number, the number might be banned by whatsapp, or you will lose a ton of money via OpenAI.

- When somebody send a message to the number you connected starting with `!chat`(or other command you configured) via whatsapp, either in groups or personal, it will reply with a response from chatGPT.
- It remembers your 4 previous messages(only that starts with `!chat`) or 2 messages back to back and you can follow up the questions with that.
- Sometimes it wont work, maybe because you filled the token limit, so what you can do is message it with `!chat delete history` to prevent from sending previous messages and you can run again.

## Keeping it running
- Since it is local, it only runs as long as your computer is running.
- Personally I run `pm2` with cron job restarting it every hour because it has some problems. If you want to do the same, run `pm2 start index.js --cron-restart="0 * * * *"`

## Deploying
- I have no idea how to deploy it, currently it uses persistant db so it is a problem. If any of you want to contribute and find a way to deploy it easily, feel free!

## Security
- OpenAI stores your message, so every message you sent with "!chat" will be remembered

## Configuration
- You can replace the default `!chat` command with anything with anything by changing the `trigger` value in `config.yaml`
