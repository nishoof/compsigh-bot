import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Pet faadil command
const PET_FAADIL = {
  name: 'petfaadil',
  description: 'Pets faadil c:',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Workingon command
const WORKINGON = {
  name: 'workingon',
  description: 'Sets the project that you are currently working on',
  options: [
    {
      type: 3,
      name: 'project',
      description: 'Enter your project\'s name',
      required: true
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const ALL_COMMANDS = [TEST_COMMAND, PET_FAADIL, WORKINGON];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
