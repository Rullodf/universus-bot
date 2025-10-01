import dotenv from 'dotenv';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'url';
import { fileURLToPath } from 'node:url';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const slashCommandsDir = 'Commands';
const eventsDir = 'Events';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cooldowns = new Collection();

await setCommands(client, slashCommandsDir);
await setEvents(client, eventsDir);

const token = process.env.TOKEN;
client.login(token);


async function setCommands(c: Client, dir: string) {
	const commandsDirPath = path.join(__dirname, dir);
	const commandsDir = fs.readdirSync(commandsDirPath).filter(name => {
		const fullPath = path.join(commandsDirPath, name);
		return fs.statSync(fullPath).isDirectory();
	}); // Legge tutte le sotto-cartelle in dir

	// Iterazione su ogni sotto-cartella di dir
	for (const subDir of commandsDir) {
		const commandsSubDirPath = path.join(commandsDirPath, subDir);
		const commandsSubDir = readdirSync(commandsSubDirPath).filter(string => string.endsWith('.js') || string.endsWith('.ts')); // Legge ogni file .js nella sotto-cartella subDir

		// Iterazione sui file letti in subDir
		for (const file of commandsSubDir) {
			const { command } = await import(pathToFileURL(path.join(commandsSubDirPath, file)).href); // Importa il comando dal file .js

			// Controllo che il file importato sia effettivamente un comando
			if (command && 'data' in command && 'execute' in command) {
				c.commands.set(command.data.name, command); // Inserisce il comando nella collection del client
			}
		}
	}
}

async function setEvents(c: Client, dir: string) {
	const eventsDirPath = path.join(__dirname, dir);
	const events = fs.readdirSync(eventsDirPath).filter(string => string.endsWith('.js') || string.endsWith('.ts'));
	for (const eventFile of events) {
		const { event } = await import(pathToFileURL(path.join(eventsDirPath, eventFile)).href);
		if (event.once) {
			c.once(event.name, (...args) => event.execute(...args));
		}
		else {
			c.on(event.name, (...args) => event.execute(...args));
		}
	}
}
