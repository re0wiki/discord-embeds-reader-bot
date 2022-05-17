import {Client, Intents} from "discord.js";
import * as token from "./token.json";

const client = new Client({intents: [Intents.FLAGS.GUILDS]});

client.login(token);
