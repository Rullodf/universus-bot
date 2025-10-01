import {
	ChatInputCommandInteraction,
	Collection,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';
import { MyCommand } from '../../../@CustomProperties/MyTypes.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { InteractionContextType } from 'discord.js';
const tagRolesPath = path.join('Bot', 'Resources', 'tagRoles.json');
import { updateTagRolesFile } from './_writeRoles.js';

export const command: MyCommand = {
	data: new SlashCommandBuilder()
		.setName('aggiungi-ruolo')
		.setDescription('Aggiungi un ruolo all\'insieme di ruoli che verrà pingato con /tag')
		.addRoleOption(option => option
			.setName('ruolo')
			.setDescription('Ruolo da aggiungere alla lista')
			.setRequired(true))
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

	filePath: fileURLToPath(import.meta.url),

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild!.channelsTagRoles) {
            interaction.guild!.channelsTagRoles = new Collection();
		}

		if (!interaction.guild!.channelsTagRoles.get(interaction.channelId)) {
            interaction.guild!.channelsTagRoles.set(interaction.channelId, []);
		}
		if (interaction.guild!.channelsTagRoles.get(interaction.channelId)!.includes(interaction.options.getRole('ruolo')!.id)) {
			return interaction.reply('Il ruolo è già presente per questo canale');
		}
        interaction.guild!.channelsTagRoles.get(interaction.channelId)!.push(interaction.options.getRole('ruolo')!.id);

        await interaction.reply(('Ruolo inserito'));

        await updateTagRolesFile(interaction.client, tagRolesPath);
	},
};