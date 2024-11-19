import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';
import pingCommand from './commands/ping.js';
import petfaadilCommand from './commands/petfaadil.js';
import workingonCommand from './commands/workingon.js';

// Add all commands here
export const allCommands = [pingCommand, petfaadilCommand, workingonCommand];

// Array of each command's data in a JSON for discord's overwrite endpoint
let allCommandsData = [];
allCommands.forEach((command) => {
  allCommandsData.push(command.data.toJSON());
})

// Call discord's endpoint to overwrite all global commands for this bot
InstallGlobalCommands(process.env.APP_ID, allCommandsData);
