import 'dotenv/config';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { allCommands } from './commands.js';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands
client.commands = new Collection();
allCommands.forEach((command) => {
	client.commands.set(command.data.name, command);
});

// On client ready (ran only once).
client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// On command interaction
client.on(Events.InteractionCreate, async interaction => {
	// Ignore interactions that aren't slash commands
	if (!interaction.isChatInputCommand()) return;

	// Get the command
	const command = interaction.client.commands.get(interaction.commandName);

	// Error if we don't recognize the command
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	// Handle the command
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Log in to Discord
client.login(process.env.DISCORD_TOKEN);