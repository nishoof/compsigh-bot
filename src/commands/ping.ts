import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const pingCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    async execute(interaction: CommandInteraction) {
        await interaction.reply('Pong!');
    },
};

export default pingCommand;