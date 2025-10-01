import { Events, MessageFlags } from 'discord.js';
import { Collection } from 'discord.js';
import { MyEvent } from '../../@CustomProperties/MyTypes.js'; 

export const event: MyEvent = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (interaction.isChatInputCommand()) {
			const commandName = interaction.commandName;
			const command = interaction.client.commands.get(commandName);	// Ottengo il comando dal client

			// Controllo che il comando inserito sia presente nel bot
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			// Estraggo la proprietà cooldowns da client
			const { cooldowns } = interaction.client;

			// Controllo che nella Collection dei cooldowns (key: comando, value: collection timestamp per ogni utente) ci sia
			// la sotto-collection del comando attuale
			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection());
			}

			const now = Date.now();
			const timeStamps = cooldowns.get(command.data.name);		// Collection di TimeStamps (key: ID dell'utente, value: ultimo uso del comando in ms)
			const defaultCooldownDuration = 3;					// Durata di default di un comando
			const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

			// controllo limite di tempo dell'utente sul comando scelto
			if (timeStamps.has(interaction.user.id)) {
				const expirationTime = timeStamps.get(interaction.user.id) + cooldownAmount;

				if (now < expirationTime) {
					const expirationTimeSeconds = Math.round(expirationTime / 1_000);
					return interaction.reply({
						content: `Potrai usare di nuovo il comando ***/${command.data.name}*** <t:${expirationTimeSeconds}:R>`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}

			// Imposto TimeStamp all'istante in cui l'utente usa il comando
			timeStamps.set(interaction.user.id, now);
			setTimeout(() => timeStamps.delete(interaction.user.id), cooldownAmount);

			// Provo a eseguire il comando
			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: `Errore nell'esecuzione del comando ***${command.data.name}***!\nPer favore riferiscilo allo staff`,
						flags: MessageFlags.Ephemeral,
					});
				}
				else {
					await interaction.reply({
						content: `Errore nell'esecuzione del comando ***${command.data.name}***!\nPer favore riferiscilo allo staff`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}
		}
	},
};