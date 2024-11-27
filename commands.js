import 'dotenv/config';

// eslint-disable-next-line no-unused-vars
import { installGlobalCommands, installGuildCommands } from './utils.js';

import petfaadilCommand from './commands/petfaadil.js';
import workingonCommand from './commands/workingon.js';

// Add all commands here
export const allCommands = [petfaadilCommand, workingonCommand];

// Array of each command's data in a JSON for discord's overwrite endpoint
let allCommandsData = [];
allCommands.forEach((command) => {
    allCommandsData.push(command.data.toJSON());
})

// Overwrite global commands
// installGlobalCommands(process.env.APP_ID, allCommandsData);

// Overwrite guild commands
// installGuildCommands(process.env.APP_ID, process.env.TEST_GUILD_ID, allCommandsData);
// installGuildCommands(process.env.APP_ID, process.env.TEST_GUILD_ID, []);         // remove all guild commands