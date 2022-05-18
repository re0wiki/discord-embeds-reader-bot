import { Client, Intents } from "discord.js";
import * as token from "./token.json";
import { sleep } from "./utils";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const tweetUrl = /https:\/\/twitter\.com\/\w+\/status\/\d+/;
client.on("messageCreate", async (msg) => {
  // Ignore messages from myself
  if (msg.author == client.user) return;

  // Ignore messages without a tweet URL
  if (msg.content.match(tweetUrl) === null) return;

  // Wait for the embeds to appear
  await sleep(1000);

  // Handle massages without embeds
  if (msg.embeds.length === 0) {
    console.log(`No embeds: ${msg.content}`);
    return;
  }

  // Send embeds as normal message
  await msg.channel.send(msg.embeds[0].description);
  const images = msg.embeds
    .map((e) => e.image)
    .filter((img) => img !== null)
    .map((img) => img.url);
  if (images.length !== 0) await msg.channel.send({ files: images });
});

// noinspection JSIgnoredPromiseFromCall
client.login(token);
