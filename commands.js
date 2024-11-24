import 'dotenv/config';

// eslint-disable-next-line no-unused-vars
import { installGlobalCommands, installGuildCommands } from './utils.js';

import pingCommand from './commands/ping.js';
import petfaadilCommand from './commands/petfaadil.js';
import workingonCommand from './commands/workingon.js';
import dogCommand from './commands/dog.js';

// Add all commands here
export const allCommands = [pingCommand, petfaadilCommand, workingonCommand, dogCommand];

// Array of each command's data in a JSON for discord's overwrite endpoint
let allCommandsData = [];
allCommands.forEach((command) => {
  allCommandsData.push(command.data.toJSON());
})

// Overwrite global commands
// InstallGlobalCommands(process.env.APP_ID, allCommandsData);

// Overwrite guild commands
// InstallGuildCommands(process.env.APP_ID, process.env.TEST_GUILD_ID, allCommandsData);
// installGuildCommands(process.env.APP_ID, process.env.TEST_GUILD_ID, []);         // remove all guild commands