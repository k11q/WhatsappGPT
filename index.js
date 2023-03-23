import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import { ChatOpenAI } from "langchain/chat_models";
import {
	HumanChatMessage,
	SystemChatMessage,
	AIChatMessage,
} from "langchain/schema";
import dotenv from "dotenv";
import yaml from "js-yaml";
import fs from "fs";
dotenv.config();

let client = new Client({ authStrategy: new LocalAuth() });
const chat = new ChatOpenAI({ temperature: 0 });

client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
	console.log("Client is ready!");
});

client.initialize();

const config = yaml.load(fs.readFileSync("config.yaml", "utf-8"));

let chatMessages = [];
if (fs.existsSync("history.json")) {
	const fileContents = fs.readFileSync("history.json", "utf-8");
	chatMessages = JSON.parse(fileContents);
}

client.on("message", async (message) => {
	if (message.body === `${config.trigger} delete history`) {
		fs.unlinkSync("history.json");
		message.reply("history deleted");
		return;
	}
	const firstWord = message.body.split(" ").shift();
	const numberOfWords = message.body.split(" ").length;
	if (firstWord === config.trigger && numberOfWords > 1) {
		const trimmedLength = chatMessages.length - 4;
		if (trimmedLength > 0) {
			chatMessages.splice(0, trimmedLength);
		}
		chatMessages.push({
			name: message._data.notifyName,
			message: message.body,
			role: "human",
		});
		const contents = message.body.split(" ").slice(1).join(" ");
		const arr = [new SystemChatMessage(process.env.SYSTEM_MESSAGE)];
		for (const msg of chatMessages) {
			if (msg.role == "AI") {
				arr.push(new AIChatMessage(msg.message));
			} else {
				arr.push(
					new HumanChatMessage(
						`${msg.name}: ${msg.message}`
					)
				);
			}
		}
		arr.push(new HumanChatMessage(contents));
		chat.call(arr)
			.then((response) => {
				chatMessages.push({
					name: "Chat",
					message: response.text,
					role: "AI",
				});
				message.reply(response.text);
			})
			.catch((error) => {
				console.log(error);
				message.reply("error");
			});
		// Save chat history to file
		fs.writeFileSync("history.json", JSON.stringify(chatMessages));
	}
});
