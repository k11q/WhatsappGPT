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
import fs from "fs";
dotenv.config();

let client = new Client({ authStrategy: new LocalAuth() });
const chat = new ChatOpenAI({ temperature: 0 });
let chatMessages = [];

// Load chat history from file if it exists
if (fs.existsSync("history.json")) {
  const fileContents = fs.readFileSync("history.json", "utf-8");
  chatMessages = JSON.parse(fileContents);
}

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

client.on("message", (message) => {
  console.log(message);
});

client.on("message", async (message) => {
  const firstWord = message.body.split(" ").shift();
  if (firstWord === "!chat") {
    if (chatMessages.length > 20) {
      chatMessages.splice(0, 1);
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
    const response = await chat.call(arr);
    chatMessages.push({
      name: "Chat",
      message: response.text,
      role: "AI",
    });
    message.reply(response.text);

    // Save chat history to file
    fs.writeFileSync("history.json", JSON.stringify(chatMessages));
  }
});