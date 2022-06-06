import { Client, Intents, Message } from "discord.js";
import * as token from "./token.json";
import { sleep } from "./utils";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("messageCreate", async (msg) => {
  // Ignore messages from myself
  if (msg.author == client.user) return;

  // Wait for the embeds to appear
  await sleep(3000);

  // Handle massages without embeds
  if (msg.embeds.length === 0) {
    console.log(`No embeds: ${msg.content}`);
    return;
  }

  // Send embeds as normal messages
  const sent: Message[] = [];
  sent.push(await msg.channel.send(msg.embeds[0].description));
  const images = msg.embeds
    .map((e) => e.image)
    .filter((img) => img !== null)
    .map((img) => img.url);
  if (images.length !== 0) sent.push(await msg.channel.send({ files: images }));

  // Delete sent messages after a few seconds. They are useless for discord users.
  await sleep(10000);
  sent.forEach((msg) => msg.delete());
});

// noinspection JSIgnoredPromiseFromCall
client.login(token);
