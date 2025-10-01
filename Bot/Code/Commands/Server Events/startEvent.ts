import { MyCommand } from '../../../@CustomProperties/MyTypes.js';
import { SlashCommandBuilder } from 'discord.js';
import { fileURLToPath } from 'node:url';

export const command: MyCommand = {
	data: new SlashCommandBuilder()
		.setName('avvia-evento')
		.setDescription('riavvia un evento messo in pausa')
		.addStringOption(option => option
			.setName('evento')
			.setDescription('Evento da avviare')
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
        interaction.guild!.events.get(nome!)!.start();
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