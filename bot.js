const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = 't!'; // change this to your preferred prefix

// define a collection to hold the commands
const commands = new Discord.Collection();

// add a command to the collection
commands.set('table', {
  description: 'Displays a formatted table.',
  usage: 't!table\n| Column 1 | Column 2 |\n|----------|----------|\n| Row 1, Column 1 | Row 1, Column 2 |\n| Row 2, Column 1 | Row 2, Column 2 |'
});

// listen for the ready event
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
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
      const lines = commands.get(command).usage.split('\n');
      const rows = lines.slice(1).map((line) => line.split('|').map((cell) => cell.trim()));
      const table = createTable(rows);
      message.channel.send('`' + table + '`');
    } catch (error) {
      console.error(error);
      message.reply('There was an error processing your request.');
    }
  } else {
    message.channel.send('Invalid command.');
  }
});

// create a function to create a table from a list of arguments
function createTable(args) {
  const columnWidths = {};
  for (const arg of args) {
    const width = arg.length;
    if (!columnWidths[columnWidths.length]) {
      columnWidths[columnWidths.length] = width;
    } else {
      columnWidths[columnWidths.length] = Math.max(columnWidths[columnWidths.length], width);
    }
  }

  const table = '';
  for (const row of args) {
    table += '|';
    for (const cell of row) {
      const width = columnWidths[columnWidths.length - 1];
      const alignedCell = alignCell(cell, width);
      table += ' '.repeat(width - cell.length) + alignedCell + '|';
    }
    table += '\n';
  }

  return table;
}

// create a function to align a cell to a certain width
function alignCell(cell, width) {
  const padding = width - cell.length;
  return `${cell}${' '.repeat(padding)}`;
}

client.login(MTA5ODIwNzE0NzEzNDgyNDUwOA.GwqDHG.N-7ywM7izAn3wSuYEeeEuIX7SSuMvzNunDtn6E);
    
