import { Client, GatewayIntentBits } from "discord.js";
import * as token from "./token.json";
import { logger, sleep, unique } from "./utils";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const visited: Set<string> = new Set();

client.on("messageCreate", async (msg) => {
  // Ignore visited messages
  if (visited.has(msg.content)) {
    logger.debug(`Visited: ${msg.content}`);
    return;
  }
  visited.add(msg.content);

  // Wait for the embeds to appear
  await sleep(5000);

  // Convert the embeds to text and images
  const textArr = msg.embeds
    .flatMap((e) => [e.title, e.description])
    .filter((s) => s !== null && s.length > 0);
  const text = unique(textArr)
    .join("\n")
    .replace(/https:\/\/t.co\/\w+$/, "");
  const images = msg.embeds
    .flatMap((e) => [e.thumbnail, e.image, e.video])
    .filter((img) => img !== null)
    .map((img) => img.url);

  // Handle massages without embeds
  if (text.length === 0 && images.length === 0) {
    logger.debug(`No embeds: ${msg.content}`);
    return;
  }

  // Log the text and images
  if (text.length > 0) {
    logger.info(`text: ${text}`);
  }
  if (images.length > 0) {
    logger.info(`images: ${images}`);
  }

  // Send the text and images as a normal message
  const sent = await msg.channel.send(
    text.length > 0 ? { content: text, files: images } : { files: images }
  );

  // Delete the message sent by the bot after a few seconds.
  // It is useless for discord users.
  await sleep(10000);
  await sent.delete();
});

client.login(token).then(() => logger.info("Logged in"));
