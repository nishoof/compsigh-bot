import fs from 'fs';
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';

const imgs = [];
const folderName = './faadilImages';
fs.readdirSync(folderName).forEach((file) => {
	imgs.push(new AttachmentBuilder(`${folderName}/${file}`));
});

let faadilPetCount = 0;

const petfaadilCommand = {
	data: new SlashCommandBuilder()
		.setName('petfaadil')
		.setDescription('Pets faadil c:'),

	async execute(interaction) {
        faadilPetCount++;
		let reply = `faadil has been pet ${faadilPetCount} times`;
		let imgNum = Math.floor(Math.random() * 6);
		await interaction.reply({
			content: reply,
			files: [imgs[imgNum]]
		});
	},
};

export default petfaadilCommand;