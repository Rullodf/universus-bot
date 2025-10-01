import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';
import { pathToFileURL } from 'url';
import fs from 'node:fs';
import path from 'node:path';
import { readdirSync } from 'node:fs';
import {MyCommand} from "../../../@CustomProperties/MyTypes.ts";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

export const command: MyCommand = {
	data: new SlashCommandBuilder()
		.setName('reload-all-commands')
		.setDescription('Ricarica un comando sul bot'),

	filePath: __filename,
	testOnly: true,

	async execute(interaction: ChatInputCommandInteraction) {

		await interaction.deferReply();

		let counter = 0;
		const commandsDirPath = path.join(__dirname, '..');
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
				const { command: newCommand} = await import(pathToFileURL(path.join(commandsSubDirPath, file)).href); // Importa il comando dal file .js

				// Controllo che il file importato sia effettivamente un comando
				if ('data' in newCommand && 'execute' in newCommand) {

					interaction.client.commands.set(newCommand.data.name, newCommand); // Inserisce il comando nella collection del client
					counter++;
				}
			}
		}

		await interaction.editReply(`Ricarica di ${counter} comandi avvenuta con successo`);
	},
};