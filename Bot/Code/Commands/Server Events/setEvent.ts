import { MyCommand } from '../../../@CustomProperties/MyTypes.js';
import { fileURLToPath } from 'node:url';
import { Collection, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';
import nodeCron, { ScheduledTask } from 'node-cron';
import { sendWebhookMessage } from '../../methods/sendWebhookMessage.js';

export const command: MyCommand = {
	filePath: fileURLToPath(import.meta.url),
	data: new SlashCommandBuilder()
		.setName('imposta-evento')
		.setDescription('Scegli il numero del mese da impostare')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
		.addStringOption(option => option
			.setName('nome')
			.setDescription('Nome dell\'evento')
			.setRequired(true))
		.addIntegerOption(option => option
			.setName('giorno')
			.setDescription('Giorno della settimana')
			.setRequired(true))
		.addStringOption(option => option
			.setName('messaggio')
			.setDescription('Messaggio del contest')
			.setRequired(true))
		.addChannelOption(option => option
			.setName('canale')
			.setDescription('Canale in cui verrà mandato il messaggio'))
		.addIntegerOption(option => option
			.setName('ora')
			.setDescription('Ora dell\'invio del messaggio'))
		.addIntegerOption(option => option
			.setName('minuto')
			.setDescription('Minuto dell\'invio del messaggio')),

	execute: async (interaction) => {
		await interaction.deferReply();
		const giorno = interaction.options.getInteger('giorno');
		const ora = interaction.options.getInteger('ora') ?? 12;
		const minuto = interaction.options.getInteger('minuto') ?? 0;
		const nodeCronSettings = `${minuto} ${ora} ${giorno} * *`;
		const nome = interaction.options.getString('nome');
		const canale = interaction.options.getChannel('canale') ?? interaction.channel;

		if (!interaction.guild!.events) {
            interaction.guild!.events = new Collection<string, ScheduledTask>();
		}

		if (interaction.guild!.events.has(nome!)) {
			return interaction.followUp(`Esiste già un evento chiamato ${nome}`);
		}

		const task = nodeCron.schedule(nodeCronSettings, async () => {
			await sendWebhookMessage(interaction, interaction.options.getString('messaggio')!, { channel: canale! as TextChannel });
		});

		if (task) {
			interaction.guild!.events.set(nome!, task);
			return interaction.followUp(('Evento impostato con successo'));
		}
		return interaction.followUp('Errore nella creazione del contest');
	},
};