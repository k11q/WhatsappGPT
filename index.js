import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, RemoteAuth } = pkg;
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import yaml from "js-yaml";
import fs from "fs";
dotenv.config();
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";

const config = yaml.load(fs.readFileSync("config.yaml", "utf-8"));

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
let systemMessage = { role: "system", content: process.env.SYSTEM_MESSAGE };
let memory = [systemMessage];

// Load the session data
mongoose.connect(process.env.MONGODB_URI).then(async () => {
	const store = new MongoStore({ mongoose: mongoose });
	const client = new Client({
		puppeteer: {
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		},
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

	let lastMessageTime = new Date().getTime();

	client.on("message", async (message) => {
		const currentTime = new Date().getTime();
		const elapsedTime =
			(currentTime - lastMessageTime) / (1000 * 60);
		if (
			message.body === "!chat delete history" ||
			(elapsedTime >= 30 && memory.length > 1)
		) {
			if (message.body === "!chat delete history") {
				memory = [systemMessage];
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
			memory.push({ role: "user", content: contents });
			try {
				const completion =
					await openai.createChatCompletion({
						model: "gpt-3.5-turbo",
						messages: memory,
					});
				message.reply(
					completion.data.choices[0].message
						.content
				);
				memory.push({
					role: "assistant",
					content: completion.data.choices[0]
						.message.content,
				});
			} catch (error) {
				message.reply("error");
				console.log(error);
			}
			lastMessageTime = currentTime;
		}
	});
});
