const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '/'; // change this to your preferred prefix
// define a collection to hold the commands and their descriptions
const commands = new Discord.Collection();
commands.set('table', {
  description: 'Displays a formatted table.',
  usage: '/table \n| Column 1 | Column 2 |\n|----------|----------|\n| Row 1, Column 1 | Row 1, Column 2 |\n| Row 2, Column 1 | Row 2, Column 2 |'
});
commands.set('create', {
  description: 'Creates a table based on user prompts.',
  usage: '/create'
});
commands.set('ping', {
  description: 'Replies with a pong.',
  usage: '/ping'
});

// listen for the ready event
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // set the bot status to 'online'
  client.user.setStatus('online');
});

// listen for the message event
client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    const commandsList = commands.map((cmd) => `**${cmd.usage}** - ${cmd.description}`).join('\n');
    const embed = new Discord.MessageEmbed().setColor('#0099ff').setTitle('Commands List').setDescription(commandsList);
    message.channel.send(embed);
  } else if (command === 'table') {
    try {
      const lines = args.join(' ').split('\n');
      const rows = lines.slice(1).map((line) => line.split('|').map((cell) => cell.trim()).filter((cell) => cell !== ''));
      const table = createTable(rows);
      message.channel.send('```' + table + '```');
    } catch (error) {
      console.error(error);
      message.reply('There was an error processing your request. Please check the table format and try again.');
    }
  } else if (command === 'create') {
    const collectedData = await collectData(message);
    if (!collectedData) {
      message.reply('The process has been cancelled.');
      return;
    }
    const rows = collectedData.map((data) => Object.values(data));
    const columns = Object.keys(collectedData[0]);
    const table = createTable([columns, ...rows]);
    message.channel.send('```' + table + '```');
  } else if (command === 'ping') {
    message.channel.send('Pong!');
  } else {
    message.channel.send('Invalid command.');
  }
});

// create a function to create a table from a list of arguments
function createTable(rows) {
  if (rows.length < 2) {
    throw new Error('Invalid table format');
  }
  const expectedHeaderLine = '| Column 1 | Column 2 |';
  if (rows[0].join(' | ') !== expectedHeaderLine) {
    throw new Error('Invalid table format');
  }
  const columnsWidth = getColumnsWidth(rows);
  const separatorLine = `|${columnsWidth.map((width) => '-'.repeat(width + 2)).join('|')}|`;
  const formattedRows = rows.map((row) =>
    `|${row
      .map((cell, i) => `${cell.padEnd(columnsWidth[i])} `)
      .join('|')}|`
  );
  return [separatorLine, ...formattedRows, separatorLine].join('\n');
}

// get maximum width of each column
function getColumnsWidth(rows) {
  const columnsCount = rows[0].length;
  const widths = new Array(columnsCount).fill(0);
  for (const row of rows) {
    for (let i = 0; i < columnsCount; i++) {
      widths[i] = Math.max(widths[i], row[i].length);
    }
  }
  return widths;
}

// collect data from user prompts
async function collectData(message) {
  const prompts = ['Enter a value for Column 1:', 'Enter a value for Column 2:'];
  const collectedData = [];
  for (prompt of prompts) {
    const response = await getUserInput(message, prompt);
    if (!response) {
      return null;
    }
    collectedData.push(response);
  }
  return collectedData;
}

// get a user's response to a prompt
async function getUserInput(message, prompt) {
  const filter = (response) => {
    return response.author.id === message.author.id;
  };
  message.channel.send(prompt);
  const response = await message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
    .then((collected) => {
      return collected.first().content;
    })
    .catch(() => {
      message.reply('You did not provide a response in time. The process has been cancelled.');
      return null;
    });
  return response;
}

client.login(MTA5ODIwNzE0NzEzNDgyNDUwOA.GwqDHG.N-7ywM7izAn3wSuYEeeEuIX7SSuMvzNunDtn6E);
    
