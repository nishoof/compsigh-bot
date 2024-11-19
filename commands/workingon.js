import { SlashCommandBuilder } from 'discord.js';

let workingonData = {};

const workingonCommand = {
	data: new SlashCommandBuilder()
		.setName('workingon')
		.setDescription('Sets the project that you are currently working on')
        .addStringOption(option => 
            option.setName('project')
            .setDescription('Your project\'s name')
            .setRequired(true)
            .setMaxLength(20)
        ),

    async execute(interaction) {
        const userid = interaction.user.id;
        const usernick = interaction.member.nickname || interaction.user.username;
        const projectName = interaction.options.getString('project');

        workingonData[userid] = { user: usernick, project: projectName}
        console.log(workingonData);

		await interaction.reply(`${usernick} is now working on ${projectName}!`);
	},
};

export default workingonCommand;