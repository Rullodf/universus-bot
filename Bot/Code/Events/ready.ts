import { Client, Collection, Events, Snowflake } from 'discord.js';
import { MyEvent } from '../../@CustomProperties/MyTypes.js';
import path from 'node:path';
import fsP from 'fs/promises';
const tagRolesJSONPath = path.join('Bot', 'Resources', 'tagRoles.json');
export const event: MyEvent = {
	name: Events.ClientReady,
	once: true,
	async execute(client: Client<true>) {
		console.log(`Il bot ${client.user.tag} è online`);
		await checkChannelRolesFile(tagRolesJSONPath, client); 
	},
};

async function checkChannelRolesFile(jsonFilePath: string, c: Client<true>) {
	let file = '';
	const toDelete: string[] = [];
	try {
		file = await fsP.readFile(jsonFilePath, 'utf-8');
	}
	catch (e) {
		await fsP.writeFile(jsonFilePath, '[]');
	}

	let guildCollection: Collection<Snowflake, Collection<Snowflake, Snowflake[]>>;

	try {
		guildCollection = jsonToCollection(file, c);
	}
	catch (e) {
		guildCollection = new Collection<Snowflake, Collection<Snowflake, Snowflake[]>>();
	}

	for (const [id, _] of guildCollection) {
		if (id && !c.guilds.cache.has(id)) {
			toDelete.push(id);
		}
	}

	for (const id of toDelete) {
		guildCollection.delete(id);
	}

	for (const [id, _] of c.guilds.cache) {
		if (!guildCollection.has(id)) {
			guildCollection.set(id, new Collection<Snowflake, Snowflake[]>());
		}
	}

	await fsP
		.writeFile(jsonFilePath, JSON
			.stringify(guildCollection
				.filter(value => value.size > 0)));

	for (const [id, value] of guildCollection) {
		const g = c.guilds.cache.get(id);
		if (g) {
			g.channelsTagRoles = value;
		}
	}

	const a = 5;
}

function jsonToCollection(string: string, c: Client<true>) {

	const parsedList = JSON.parse(string);

	const guildsCollection = new Collection<Snowflake, Collection<Snowflake, Snowflake[]>>();

	for (const [guildID, channelsList] of parsedList) {
		const channelsCollection = new Collection<Snowflake, Snowflake[]>();
		guildsCollection.set(guildID, channelsCollection);

		for (const [channelID, rolesList] of channelsList) {
			channelsCollection.set(channelID, rolesList);
		}
	}
	return guildsCollection;
}