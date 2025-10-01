const path = require('node:path');
const { readdirSync } = require('node:fs');
const { REST, Routes } = require('discord.js');
const { clientID, token } = require('../../../../Bot/Resources/config.json');
const fs = require('node:fs');

const dirs = readdirSync(__dirname).filter(name => {
	const fullPath = path.join(__dirname, name);
	return fs.statSync(fullPath).isDirectory();
});
const commands = [];

for (const dir of dirs) {
	const files = readdirSync(dir).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

	for (const file of files) {
		const commandFile = path.join(__dirname, dir, file);
		const command = require(commandFile);
		if (!command.testOnly) {
			commands.push(command.data.toJSON());
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Inizio l'invio di ${commands.length} comandi`);

		const data = await rest.put(Routes.applicationCommands(clientID),
			{ body: commands },
		);

		console.log(`Invio di ${data.length} comandi avvenuto con successo`);
	}
	catch (e) {
		console.error(e);
	}
})();