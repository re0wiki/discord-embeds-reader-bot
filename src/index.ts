import { Client, Intents } from "discord.js";
import * as token from "./token.json";
import { sleep } from "./utils";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const tweetUrl = /https:\/\/twitter\.com\/\w+\/status\/\d+/;
client.on("messageCreate", async (message) => {
  // Ignore messages from myself
  if (message.author == client.user) return;

  // Ignore messages without tweet URL
  if (message.content.match(tweetUrl) === null) return;

  // Wait for the embed to appear
  await sleep(1000);

  // Handle massages without embeds
  if (message.embeds.length === 0) {
    console.log(`No embeds: ${message.content}`);
    return;
  }

  // Send embed content as normal message
  const embed = message.embeds[0];
  await message.channel.send(embed.description);
});

// noinspection JSIgnoredPromiseFromCall
client.login(token);
