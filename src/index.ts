import { Client, Intents, Message } from "discord.js";
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
    .map((e) => e.description)
    .filter((d) => d.length > 0)
    .join("\n");
  const images = msg.embeds
    .map((e) => e.image)
    .filter((img) => img !== null)
    .map((img) => img.url);

  // Handle massages without embeds
  if (text.length === 0 && images.length === 0) {
    logger.debug(`No embeds: ${msg.content}`);
    return;
  }

  // Send the converted message
  let sent: Message;
  if (images.length === 0) {
    logger.info(`Sending text: ${text}`);
    sent = await msg.channel.send(text);
  } else if (text.length === 0) {
    logger.info(`Sending images: ${images}`);
    sent = await msg.channel.send({ files: images });
  } else {
    logger.info(`Sending text and ${images.length} images: ${text} ${images}`);
    sent = await msg.channel.send({ content: text, files: images });
  }

  // Delete the converted message after a few seconds.
  // They are useless for discord users.
  await sleep(10000);
  await sent.delete();
});

client.login(token).then(() => logger.info("Logged in"));
