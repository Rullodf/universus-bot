import {SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction,} from 'discord.js';
import {MyCommand} from "../../../@CustomProperties/MyTypes.ts";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

export const command: MyCommand = {
	cooldown: 1800,
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicka un membro dal server')
		.addUserOption(option =>
			option.setName('utente')
				.setDescription('Utente da bannare')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('motivo')
				.setDescription('Ragione del kick'),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	filePath: __filename,

	async execute(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('utente', true);
		const reason = interaction.options.getString('motivo') ?? 'Perché si';
		if (!interaction.guild){
			return interaction.reply('errore');
		}
		await interaction.guild.members.kick(user);
		await interaction.reply(`Utente ${user.id} è stato kickato per il seguente motivo:\n ${reason}`);

	},
};