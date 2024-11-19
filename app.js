import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji, getRandomFaadilImage } from './utils.js';

// Max char length settings
const MAX_NICK_LENGTH = 20;
const MAX_PROJ_NAME_LENGTH = 20;

// Create and configure express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

// TODO: switch to database before production
// Store faadil pet count
let faadilPetCount = 0;
// Store workingon data
let workingonData = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `hello world ${getRandomEmoji()}`,
        },
      });
    }

    // "petfaadil" command
    if (name === 'petfaadil') {
      const faadilImage = getRandomFaadilImage();
      console.log('img: ', faadilImage);
      faadilPetCount++;

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `faadil has been pet ${faadilPetCount} times`,
          files: [faadilImage]    // TODO: fix
        },
      });
    }

    // "workingon" command
    if (name === 'workingon') {
      const userId = req.body.member.user.id;
      const userNick = req.body.member.nick || req.body.member.user.username;
      const projectName = req.body.data.options[0].value;

      if (userNick.length > MAX_NICK_LENGTH) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Your nickname is too long! Must be 15 characters or less`
          },
        });
      }

      if (projectName.length > MAX_PROJ_NAME_LENGTH) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Your project name is too long! Must be 15 characters or less`
          },
        });
      }

      workingonData[userId] = { userNick: userNick, projectName: projectName };

      console.log(workingonData);

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `${userNick} is now working on ${projectName}`
        },
      });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
