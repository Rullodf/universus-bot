import { MyCommand } from '../../../@CustomProperties/MyTypes.js';
import { fileURLToPath } from 'node:url';
import { InteractionContextType, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { sendWebhookMessage } from '../../methods/sendWebhookMessage.js';

const __filename = fileURLToPath(import.meta.url);

export const command: MyCommand = {
	data: new SlashCommandBuilder()
		.setName('tag')
		.setDescription('Tagga il ruolo di questo canale con un messaggio [opzionale]')
		.addStringOption(option =>
			option.setName('messaggio')
				.setDescription('Messaggio da inviare agli utenti taggati'))
		.setContexts(InteractionContextType.Guild),
	filePath: __filename,
	cooldown: 40 * 60,
	async execute(interaction) {
		const user = interaction.user;

		let fullMessage = '';

		if (!interaction.guild!.channelsTagRoles) {
			return interaction.reply({ content: '/tag non può essere usato in questo canale', flags: MessageFlags.Ephemeral });
		}
		if (!interaction.guild!.channelsTagRoles.get(interaction.channelId)) {
			return interaction.reply({ content: '/tag non può essere usato in questo canale', flags: MessageFlags.Ephemeral });
		}
		if (interaction.guild!.channelsTagRoles.size == 0) {
			return interaction.reply({ content: '/tag non può essere usato in questo canale', flags: MessageFlags.Ephemeral });
		}

		for (const roleID of interaction.guild!.channelsTagRoles.get(interaction.channelId)!) {
			fullMessage += `<@&${roleID}> `;
		}

		fullMessage += interaction.options.getString('messaggio');

		await interaction.reply({ content: 'Invio il messaggio', flags: MessageFlags.Ephemeral });
		await sendWebhookMessage(interaction, fullMessage, { name: user.displayName, avatar: user.displayAvatarURL() });
		await interaction.deleteReply();
	}, 
};