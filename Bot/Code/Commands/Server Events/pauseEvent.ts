import { MyCommand } from '../../../@CustomProperties/MyTypes.js';
import { SlashCommandBuilder } from 'discord.js';
import { fileURLToPath } from 'node:url';

export const command: MyCommand = {
	data: new SlashCommandBuilder()
		.setName('stop-evento')
		.setDescription('Mette un evento in pausa')
		.addStringOption(option => option
			.setName('evento')
			.setDescription('Evento da mettere in pausa')
			.setRequired(true)
			.setAutocomplete(true)),
	filePath: fileURLToPath(import.meta.url),
	execute: async (interaction) => {
		if (!interaction.guild!.events) {
			return interaction.reply('Nessun evento impostato');
		}
		const nome = interaction.options.getString('evento');
		if (!(nome! in interaction.guild!.events)) {
			return interaction.reply('Evento inesistente');
		}
        interaction.guild!.events.get(nome!)!.stop();
	},
	autocomplete: async (interaction) => {
		if (!interaction.guild!.events) {
			return interaction.respond([]);
		}
		const focusedValue = interaction.options.getFocused();
		const choices = [...interaction.guild!.events.keys()];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},

};