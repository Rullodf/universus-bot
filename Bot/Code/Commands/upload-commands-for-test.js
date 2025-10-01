import dotenv from 'dotenv';
import { readdirSync } from 'node:fs';
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'url';
dotenv.config();

const token = process.env.TOKEN;
const clientID = process.env.CLIENT_ID;
const testGuildID = process.env.TEST_GUILD_ID;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dirs = readdirSync(__dirname).filter(name => {
	const fullPath = path.join(__dirname, name);
	return fs.statSync(fullPath).isDirectory();
});
const commands = []; 

(async () => {
	for (const dir of dirs) {
		const files = readdirSync(__dirname + '\\' + dir).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

		for (const file of files) {
			const commandFile = path.join(__dirname, dir, file);
			const { command } = await import(pathToFileURL(commandFile).href);
			if (command) {
				commands.push(command.data.toJSON());
			}
		}
	}

	const rest = new REST().setToken(token);

	try {
		console.log(`Inizio l'invio di ${commands.length} comandi`);

		const data = await rest.put(Routes.applicationGuildCommands(clientID, testGuildID),
			{ body: commands },
		);

		console.log(`Invio di ${data.length} comandi avvenuto con successo`);
	}
	catch (e) {
		console.error(e);
	}
})();