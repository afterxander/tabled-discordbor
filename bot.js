const Discord = require('discord.js');
const client = new Discord.Client(MTA5ODIwNzE0NzEzNDgyNDUwOA.GwqDHG.N-7ywM7izAn3wSuYEeeEuIX7SSuMvzNunDtn6E);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.content.startsWith('t!table')) {
    const lines = message.content.split('\n');
    const options = lines[0].substring(8).trim();
    const rows = lines.slice(1).map(line => line.split('|').map(cell => cell.trim()));
    const table = createTable(rows, options);
    message.channel.send('```' + table + '```');
  }
});

function createTable(rows, options) {
  const opts = parseOptions(options);
  const widths = getColumnWidths(rows, opts);
  const borderChars = getBorderChars(opts.border);
  let table = '';

  rows.forEach((row, i) => {
    if (i === 0 || opts.lineOnAllRows) {
      table += getRowSeparator(widths, borderChars);
    }

    table += '|';
    row.forEach((cell, j) => {
      const width = widths[j] + opts.colPaddingLeft + opts.colPaddingRight;
      const alignedCell = alignCell(cell, width, opts.colAlignment);
      table += ' '.repeat(opts.colPaddingLeft) + alignedCell + ' '.repeat(opts.colPaddingRight) + '|';
    });

    table += '\n';
  });

  if (rows.length > 1) {
    table += getRowSeparator(widths, borderChars);
  }

  return table;
}

function parseOptions(optionsString) {
  const options = {
    lineOnAllRows: false,
    singleLine: false,
    border: 'honeywell',
    colWidths: {},
    colPaddingLeft: 0,
    colPaddingRight: 0,
    colWordWrap: false,
    colTruncate: 100,
    colAlignment: 'left'
  };

  optionsString.split(/\s+/).forEach(option => {
    const parts = option.split('=');
    const key = parts[0].replace('--', '');
    const value = parts.length > 1 ? parts[1] : true;

    if (key.startsWith('col')) {
      const colParts = key.split('.');
      const index = colParts[1];
      const colKey = colParts[2];

      if (!options.colWidths[index]) {
        options.colWidths[index] = {};
      }

      options.colWidths[index][colKey] = value;
    } else {
      options[key] = value;
    }
  });

  return options;
}

function getColumnWidths(rows, opts) {
  const colWidths = {};

  rows.forEach(row => {
    row.forEach((cell, i) => {
      const colOpts = opts.colWidths[i] || {};
      const contentWidth = cell.length;
      const width = colOpts.width ? parseInt(colOpts.width) : contentWidth;
      colWidths[i] = Math.max(colWidths[i] || 0, width);
    });
  });

  return Object.values(colWidths);
}

function getBorderChars(border) {
  const borders = {
    honeywell: { h: '-', v: '|', tl: '+', tr: '+', bl: '+', br: '+' },
    norc: { h: '-', v: '|', tl: '+', tr: '+', bl: '+', br: '+' },
    ramac: { h: '-', v:
    
