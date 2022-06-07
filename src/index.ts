import { Client, Intents } from "discord.js";
import * as token from "./token.json";
import { logger, sleep } from "./utils";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("messageCreate", async (msg) => {
  // Ignore messages from myself
  if (msg.author == client.user) {
    logger.debug(`From myself: ${msg.content}`);
    return;
  }

  // Wait for the embeds to appear
  await sleep(5000);

  // Convert the embeds to text and images
  const text = msg.embeds
    .flatMap((e) => [e.title, e.description])
    .filter((s) => s !== null && s.length > 0)
    .join("\n");
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
  const sent = await msg.channel.send({ content: text, files: images });

  // Delete the message sent by the bot after a few seconds.
  // It is useless for discord users.
  await sleep(10000);
  await sent.delete();
});

client.login(token).then(() => logger.info("Logged in"));
