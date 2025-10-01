import { ChatInputCommandInteraction, TextChannel } from 'discord.js';

type webhookOptions =
	|{ name: string, avatar: string }
	|{ channel: TextChannel, name?: string, avatar?: string }

export async function sendWebhookMessage(interaction:ChatInputCommandInteraction, message: string, options?: webhookOptions) {

	let webhookChannel;
	let webhookAvatar;
	let webhookName;

	if (options) {
		 webhookChannel = 'channel' in options
			? options.channel
			: interaction.channel as TextChannel;
		 webhookName = options.name ?? interaction.client.user.displayName;
		webhookAvatar = options.avatar ?? interaction.client.user.displayAvatarURL();
	}
	else {
		webhookChannel = interaction.channel as TextChannel;
		webhookName = interaction.client.user.displayName;
		webhookAvatar = interaction.client.user.displayAvatarURL();
	}
	const webhook = await webhookChannel.createWebhook({
		name: webhookName,
		avatar: webhookAvatar,
	});

	await webhook.send(message);
	await webhook.delete();
}
