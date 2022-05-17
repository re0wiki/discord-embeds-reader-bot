import {Client, Intents} from "discord.js";
import * as token from "./token.json";

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const tweetUrl = /https:\/\/twitter\.com\/\w+\/status\/\d+/;
client.on("messageCreate", (message) => {
    const match = message.content.match(tweetUrl);
    if (match !== null) {
        const url = match[0];
        message.channel.send(`Got <${url}>`);
    }
});

// noinspection JSIgnoredPromiseFromCall
client.login(token);
