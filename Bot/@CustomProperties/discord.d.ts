import { Collection, Events, Snowflake } from 'discord.js';
import 'discord.js';
import { ScheduledTask } from 'node-cron';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, MyCommand>;
        events: Collection<string, Events>;
        cooldowns: Collection<string, Collection>// Assumendo che Events sia l'enum di discord.js
        contests: Collection
    }

    interface Guild {
        channelsTagRoles?: Collection<Snowflake, Snowflake[]>
        events?: Collection<string, ScheduledTask>
    }
}

export {};
