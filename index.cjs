const Express = require('express');
const {sync} = require('glob');
const {createServer} = require('http');
const {config} = require('dotenv');
const {Client} = require('discord.js');

const express_app = Express();
const http_server = createServer(express_app);
const client = new Client({intents: 79615});

config();
client.commands = new Map();

sync('./commands/**/**.cjs').forEach(command_path => {
  var command = require(command_path);
  command.names.forEach(name => {
    client.commands.set(name, command);
  });
});

sync('./events/**/**.cjs').forEach(event_path => {
  var event = require(event_path);
  event.run(client);
});

client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log('[DISCORD] Client conectado')
});

express_app.get('/*', (req, res) => {
  res.json({ 
    status: 200,
    message: 'OK'
  });
});

http_server.listen(process.env.PORT, () => {
  console.log(`[HTTP] Servidor conectado na porta ${process.env.PORT}`);
});