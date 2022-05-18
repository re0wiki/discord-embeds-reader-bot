import { Client, Intents } from "discord.js";
import * as token from "./token.json";
import { execSync } from "child_process";
import * as fs from "fs";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const tweetUrl = /https:\/\/twitter\.com\/\w+\/status\/\d+/;
client.on("messageCreate", (message) => {
  // Ignore messages from myself
  if (message.author == client.user) return;

  // Ignore messages without tweet URL
  const match = message.content.match(tweetUrl);
  if (match === null) return;

  const url = match[0];
  console.log(url);
  execSync(`snap-tweet ${url} --output-dir ./tmp`);
  const file = fs.readdirSync("tmp")[0];
  message.channel.send({
    files: [
      {
        attachment: `./tmp/${file}`,
      },
    ],
  });
  fs.rmSync(`./tmp/${file}`);
});

// noinspection JSIgnoredPromiseFromCall
client.login(token);
