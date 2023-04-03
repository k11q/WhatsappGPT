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

### Quick Start
1. First, you need to setup OpenAI API and put a system message.
- If you don't have an OpenAI account, [sign up first](https://auth0.openai.com/u/signup), then [create your secret key](https://platform.openai.com/overview).
2. Setup your mongodb database. [register here](https://mongodb.com/)
- Create your cluster.
3. Add OpenAI API key, system message and mongodb URI in the .env file.
-  System message can be anything, it is the first prompt chatgpt will listen to, we use it to setup how the AI chat should behave. You can put rules there.
4. Then, you need to setup your whatsapp client. From the remote directory, run `npm run setup`
5. Wait for it to produce a QR code, scan it with your phone to connect to your number.
6. When it logs `Client is ready!`, close with `shift` and `C`.
7. Then run `npm run start`
8. You are done with the setup! Now any message received that starts with `!chat`(and space after) would be answered with a ChatGPT response!

## Usage

> **Note**
> Right now error handling via the API call isn't working. Don't mad at me.

> **Warning**
> Caution with sharing your number connected to this. Incase somebody spam your number, the number might be banned by whatsapp, or you will lose a ton of money via OpenAI.

- When somebody send a message to the number you connected starting with `!chat`(or other command you configured) via whatsapp, either in groups or personal, it will reply with a response from chatGPT.
- It remembers your previous messages(only that starts with `!chat`) and you can follow up the questions with that.
- The memory will be deleted if you havent used !chat for more than 30 minutes or you restart the server.
- If you want to delete the memory manually, message the chat with `!chat delete history` and it will wipe the memory, this is useful if you dont want to overuse the token.

## Deploying
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/HMHiAG?referralCode=E44ptv)

Deploy on railway is the easiest method. Once you've set up your number and store it with mongo, just deploy and your whatsapp will forever be connected! Add your environment variables in railway.

## Security
- OpenAI stores your message, so every message you sent with "!chat" will be remembered

## Configuration
- You can replace the default `!chat` command with anything with anything by changing the `trigger` value in `config.yaml`

## Legal
- This isn't affiliated in any way with OpenAI or Whatsapp.

> **Warning**
> Whatsapp prohibits the use of unauthirized bots on their platform. Use this at your own risk.
