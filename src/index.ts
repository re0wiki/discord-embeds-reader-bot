import {Client, GatewayIntentBits} from "discord.js";
import * as token from "./token.json";
import {logger, sleep, unique} from "./utils";
import * as Sentry from "@sentry/browser";

Sentry.init({
    dsn: "https://f7000f8a41884fb2adf01158278293fb@o996799.ingest.sentry.io/6617943",
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("messageCreate", async (msg) => {
    // Ignore messages sent by the bot itself.
    if (msg.author.id === client.user?.id) {
        logger.info(`Ignored message sent by myself: ${msg.content}`);
        return;
    }

    // Wait for the embeds to appear.
    await sleep(5000);

    // Log the message.
    logger.debug(JSON.stringify(msg, null, 2));

    // Convert the embeds to text and images.
    const textArr = msg.embeds
        .flatMap((e) => [e.author?.name, e.title, e.description, e.url])
        .filter((s) => s !== null && s !== undefined && s.length > 0);
    const text = unique(textArr)
        .join("\n")
        .replace(/pixiv\.kikkia\.dev.*\/(\d+)_p0.*/, "www.pixiv.net/artworks/$1");
    const pixivRegex = /(?<=pixiv\.kikkia\.dev\/).*(img.*)_.*/;
    const images = msg.embeds
        .flatMap((e) => [e.thumbnail, e.image])
        .filter((img) => img !== null)
        .map((img) => img.url)
        .flatMap((url) => pixivRegex.test(url) ? [
            url.replace(pixivRegex, "img-original/$1.jpg"),
            url.replace(pixivRegex, "img-original/$1.png"),
        ] : [url]);

    // Handle massages without embeds.
    if (text.length === 0 && images.length === 0) {
        logger.info(`No embeds: ${msg.content}`);
        return;
    }

    // Log the text and images.
    if (text.length > 0) {
        logger.info(`text: ${text}`);
    }
    if (images.length > 0) {
        logger.info(`images: ${images}`);
    }

    // Send the text and images as a normal message.
    const sent = await msg.channel.send(
        text.length > 0 ? {content: text, files: images} : {files: images}
    );

    // Delete the message sent by the bot after a few seconds.
    // It is useless for discord users.
    await sleep(10000);
    await sent.delete();
});

client.login(token).then(() => logger.info("Logged in"));
