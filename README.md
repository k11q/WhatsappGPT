<p align="center">
<img src="https://raw.githubusercontent.com/khairulhaaziq/whatsappgpt/main/whatsapp-gpt.png" alt="WhatsappGPT - ChatGPT in your whatsapp" width="300">
<br>
<h1>WhatsappGPT</h1>
<br>
ChatGPT in your whatsapp, with your own phone number!
</p>

## Installation
- Clone the repo
- Create .env file (or just remove the .env.example to .env)
- Add the OpenAI API key there and the system message.
- System message can be anything, it is the first prompt chatgpt will listen to, and should be stronger than a normal user prompt. You can put rules there.

## Getting Started

### Local
- First, you need to setup your whatsapp client. From the remote directory, run `npm run setup`
- Then it will produce a QR code, connect it to your whatsapp number.
- When it logs `Client is ready!`, close with `shift` and `C`
- Then run `npm run start`
- You are done with the setup! Now any message received that starts with `!chat`(and space after) would be answered with a ChatGPT response!


## Keeping it running
- Since it is local, it only runs as long as your computer runs.
- Personally I run `pm2` with cron job restarting it every hour because it has some problems. If you want to do the same, run `pm2 start index.js --cron-restart="0 * * * *"`

## Deploying
- I have no idea how to deploy it, currently it uses persistant db so it is a problem. If any of you want to contribute and find a way to deploy it easily, feel free!

## Security
- OpenAI stores your message, so every message you sent with "!chat" will be remembered

## Customization
- You can replace the default `!chat` command with anything with anything by changing the `trigger` value in `config.yaml`

## Usage
- Does the chat remember my previous chats? Yes, up to 4 previous messages(2 back to back messages), I am planning to allow to configure it easily, but right now this can be changed manually in `index.js`.

## Advance API
- `!chat delete history` - Sometimes you might exceed the number of tokens(because it includes history). So running this will delete all history so you can make another command

> **Note**
> Right now error handling via the API call isn't working. Don't mad at me.

> **Warning**
> Caution with sharing your number connected to this. Incase somebody spam your number, the number might be banned by whatsapp, or you will lose a ton of money via OpenAI.