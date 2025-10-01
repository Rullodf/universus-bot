import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';
import {MyCommand} from "../../../@CustomProperties/MyTypes.ts";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

export const command: MyCommand = {
	cooldown: 18000,
	data: new SlashCommandBuilder()
		.setName('nuovo-ticket')
		.setDescription('Crea un nuovo ticket per chiedere supporto allo staff'),
	filePath: __filename,

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('Suca');
	},
};