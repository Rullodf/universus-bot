import { MyEvent } from '../../@CustomProperties/MyTypes.js';
import { Events } from 'discord.js';


export const event: MyEvent = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isAutocomplete()) {
			try {
				const command = interaction.client.commands.get(interaction.commandName);
				await command.autocomplete(interaction);
			}
			catch (e) {
				console.error(e);
			}
		}
	},
};