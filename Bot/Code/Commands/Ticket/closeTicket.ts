import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';
import {MyCommand} from "../../../@CustomProperties/MyTypes.ts";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

export const command: MyCommand = {
	data: new SlashCommandBuilder()
		.setName('chiudi-ticket')
		.setDescription('Chiude il ticket aperto da un utente'),
	filePath: __filename,

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.reply('Suca');
	},
};