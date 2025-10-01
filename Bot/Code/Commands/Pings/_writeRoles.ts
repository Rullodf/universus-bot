import { Client, Collection } from 'discord.js';
import { writeFile } from 'node:fs/promises';

export async function updateTagRolesFile(c: Client<true>, tagRolesPath: string) {
	const guildsCollection = new Collection();

	for (const guild of c.guilds.cache.values()) {
		if (guild.channelsTagRoles) {
			guildsCollection.set(guild.id, guild.channelsTagRoles);
		}
	}

	await writeFile(tagRolesPath, JSON.stringify(guildsCollection));
}