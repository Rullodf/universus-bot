import { MyCommand } from '../../../@CustomProperties/MyTypes.js';
import { BaseGuildTextChannel, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { fileURLToPath } from 'node:url';
import nodeCron from 'node-cron';

export const command: MyCommand = {
	data: new SlashCommandBuilder()
		.setName('crea-contest')
		.setDescription('Crea un nuovo contest')
		.addStringOption(option => option
			.setName('nome')
			.setDescription('Nome del thread')
			.setRequired(true))
		.addRoleOption(option => option
			.setName('ruolo')
			.setDescription('Ruolo da taggare')
			.setRequired(true))
		.addStringOption(option => option
			.setName('messaggio')
			.setDescription('Messaggio del contest')
			.setRequired(true))
		.addChannelOption(option => option
			.setName('canale')
			.setDescription('Canale in cui verrà creato il thread [default: canale in cui viene eseguito il comando]')),

	filePath: fileURLToPath(import.meta.url),

	execute: async (interaction: ChatInputCommandInteraction) => {
		nodeCron.schedule('0 0 1 * *', async () => {
			const channel = interaction.options.getChannel('canale') ?? interaction.channel;
			const nome = interaction.options.getString('nome');
			const messaggio = interaction.options.getString('messaggio');
			const roleID = interaction.options.getRole('ruolo')!.id;
			await creaThreadMensile(channel! as BaseGuildTextChannel, roleID, nome!, messaggio!);
		});
	},

};

async function creaThreadMensile(channel: BaseGuildTextChannel, roleID: string, threadName: string, message: string): Promise<void> {
	const now = new Date();
	channel.threads.create({
		name: `${threadName} - ${now.toLocaleString('it-IT', {
			month: 'long',
			year: 'numeric',
		})}`,
		startMessage: `${message}\n<@&${roleID}>`,
		reason: 'thread mensile',
		autoArchiveDuration: 10080,
	});
}