import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, RemoteAuth } = pkg;
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models";
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	SystemMessagePromptTemplate,
	MessagesPlaceholder,
} from "langchain/prompts";
import { BufferMemory } from "langchain/memory";
import dotenv from "dotenv";
import yaml from "js-yaml";
import fs from "fs";
dotenv.config();
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";

const config = yaml.load(fs.readFileSync("config.yaml", "utf-8"));

const chat = new ChatOpenAI({ temperature: 0.2 });
const chatPrompt = ChatPromptTemplate.fromPromptMessages([
	SystemMessagePromptTemplate.fromTemplate(process.env.SYSTEM_MESSAGE),
	new MessagesPlaceholder("history"),
	HumanMessagePromptTemplate.fromTemplate("{input}"),
]);
let chain = new ConversationChain({
	memory: new BufferMemory({
		returnMessages: true,
		memoryKey: "history",
	}),
	prompt: chatPrompt,
	llm: chat,
});

// Load the session data
mongoose.connect(process.env.MONGODB_URI).then(async () => {
	const store = new MongoStore({ mongoose: mongoose });
	const client = new Client({
		authStrategy: new RemoteAuth({
			store: store,
			backupSyncIntervalMs: 300000,
		}),
	});

	const sessionExists = await store.sessionExists({
		session: "yourSessionName",
	});

	if (sessionExists) {
		console.log("session exists");
	} else {
		client.on("qr", (qr) => {
			qrcode.generate(qr, { small: true });
		});
	}
	client.on("ready", () => {
		console.log("Client is ready!");
	});
	client.on("remote_session_saved", async () => {
		console.log("saved session");
	});

	client.initialize();

	let lastMessageTime = 0;
	let historyEmpty = true;

	client.on("message", async (message) => {
		const currentTime = new Date().getTime();
		const elapsedTime =
			(currentTime - lastMessageTime) / (1000 * 60);
		if (
			message.body === "!chat delete history" ||
			(elapsedTime >= 30 && !historyEmpty)
		) {
			chain = new ConversationChain({
				memory: new BufferMemory({
					returnMessages: true,
					memoryKey: "history",
				}),
				prompt: chatPrompt,
				llm: chat,
			});
			historyEmpty = true;
			if (message.body === "!chat delete history") {
				message.reply("history deleted");
			}
			return;
		}
		const numberOfWords = message.body.split(" ").length;
		if (
			message.body.startsWith(`${config.trigger} `) &&
			numberOfWords > 1
		) {
			const contents = message.body
				.split(" ")
				.slice(1)
				.join(" ");
			chain.call({ input: contents })
				.then((res) => {
					message.reply(res.response);
				})
				.catch((error) => {
					console.log(error);
					message.reply("error");
				});
			lastMessageTime = currentTime;
			historyEmpty = false;
		}
	});
});
