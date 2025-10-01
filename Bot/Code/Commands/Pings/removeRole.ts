import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';
import { fileURLToPath } from 'node:url';
import { updateTagRolesFile } from './_writeRoles.js';
import path from 'node:path';
const tagRolesPath = path.join('Bot', 'Resources', 'tagRoles.json');

export const command = {
	data: new SlashCommandBuilder()
		.setName('rimuovi-ruolo')
		.setDescription('Rimuovi un ruolo dai ruoli pingati da /tag')
		.addRoleOption(option => option
			.setName('ruolo')
			.setDescription('Ruolo da rimuovere')
			.setRequired(true))
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	filePath: fileURLToPath(import.meta.url),
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild!.channelsTagRoles) {
			return interaction.reply('Non ci sono ruoli da rimuovere in questo canale');
		}
		if (!interaction.guild!.channelsTagRoles.get(interaction.channelId)) {
			return interaction.reply('Non ci sono ruoli da rimuovere in questo canale');
		}
		if (!interaction.guild!.channelsTagRoles.get(interaction.channelId)!.includes(interaction.options.getRole('ruolo')!.id)) {
			return interaction.reply('Ruolo non assegnato a questo canale');
		}

		const array = interaction.guild!.channelsTagRoles.get(interaction.channelId);
        array!.splice(array!.indexOf(interaction.options.getRole('ruolo')!.id, 1));
        await interaction.reply('Ruolo rimosso');

        await updateTagRolesFile(interaction.client, tagRolesPath);
	},
};