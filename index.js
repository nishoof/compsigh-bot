import 'dotenv/config';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { allCommands } from './commands.js';

const compsighGuildId = "849685154543960085";
const guildWhitelist = [process.env.TEST_GUILD_ID, compsighGuildId];

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands
client.commands = new Collection();
allCommands.forEach((command) => {
	client.commands.set(command.data.name, command);
});

// On guild join
client.on('guildCreate', guild => {
	console.log(`Joined guild ${guild.id}`);
	if (!guildWhitelist.includes(guild.id)) {
		console.log(`Leaving guild ${guild.id} as it is not in the whitelist.`);
		guild.leave();
	}
})

// On client ready (ran only once).
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// On command interaction
client.on(Events.InteractionCreate, async interaction => {
	// Ignore interactions that aren't slash commands
	if (!interaction.isChatInputCommand()) return;

	// Ignore interactions from guilds not in the whitelist
	if (!guildWhitelist.includes(interaction.guildId)) {
		return await interaction.reply({ content: `This bot is not enabled for this guild`, ephemeral: true });
	}

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