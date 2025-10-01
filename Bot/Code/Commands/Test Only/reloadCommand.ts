import {ChatInputCommandInteraction, SlashCommandBuilder} from 'discord.js';
import {MyCommand} from "../../../@CustomProperties/MyTypes.ts";
import {pathToFileURL} from "url";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

export const command: MyCommand = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Ricarica un comando sul bot')
        .addStringOption(option =>
            option.setName('comando')
                .setDescription('Comando da ricaricare')
                .setRequired(true)),

    filePath: __filename,
    testOnly: true,

    async execute(interaction: ChatInputCommandInteraction) {
        const commandName = interaction.options.getString('comando', true);
        const cmd: MyCommand = interaction.client.commands.get(commandName);

        if (!cmd) {
            return interaction.reply(`Il comando ${commandName} non esiste`);
        }

        try {
            const { command: newCommand } = await import(pathToFileURL(cmd.filePath).href);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Comando ${newCommand.data.name} ricaricato!`);
        }
        catch (err) {
            console.error(err);
            await interaction.reply(`Errore, comando ${commandName} non ricaricato!`);
        }
    },
};