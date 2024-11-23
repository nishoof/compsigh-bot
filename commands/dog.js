import { SlashCommandBuilder } from 'discord.js';

const dogCommand = {
	data: new SlashCommandBuilder()
		.setName('dog')
		.setDescription('Replies with a dog!'),

	async execute(interaction) {
        await interaction.deferReply();

        const response = await fetch('https://random.dog/woof.json');

		if (!response.ok) {
			await interaction.editReply({
				content: 'Failed to fetch a dog :('
			});
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const responseJSON = await response.json();
	
		await interaction.editReply({
            content: `${responseJSON.url}`,
        });
	},
};

export default dogCommand;