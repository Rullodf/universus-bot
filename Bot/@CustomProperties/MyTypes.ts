import { AutocompleteInteraction, BaseInteraction, ChatInputCommandInteraction } from 'discord.js';

export interface MyCommand{
    data: unknown;
    testOnly?: boolean;
    filePath: string;
    cooldown?: number;
    execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
    autocomplete?: (Interaction: AutocompleteInteraction) => Promise<unknown>
}

export interface MyEvent {
    name: string;
    once?: boolean;
    execute: (interaction: BaseInteraction) => Promise<unknown>;
}