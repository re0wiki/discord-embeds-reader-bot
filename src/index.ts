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

  // Ignore messages without tweet URL
  if (msg.content.match(tweetUrl) === null) return;

  // Wait for the embed to appear
  await sleep(1000);

  // Handle massages without embeds
  if (msg.embeds.length === 0) {
    console.log(`No embeds: ${msg.content}`);
    return;
  }

  // Send embed content as normal message
  const embed = msg.embeds[0];
  await msg.channel.send(embed.description);
});

// noinspection JSIgnoredPromiseFromCall
client.login(token);
