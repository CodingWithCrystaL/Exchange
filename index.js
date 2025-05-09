const { Client, GatewayIntentBits, Partials, Collection, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes } = require('discord.js');
const fs = require('fs');
const express = require('express');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

// Load slash commands from /commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Auto register slash commands globally (using your CLIENT ID)
const registerCommands = async () => {
  const commands = client.commands.map(cmd => cmd.data.toJSON());
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    await rest.put(Routes.applicationCommands('1370527419202801746'), {
      body: commands
    });
    console.log('✅ Slash commands registered globally!');
  } catch (err) {
    console.error('❌ Error registering commands:', err);
  }
};

// Bot ready
client.once('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);

  const statuses = [
    '💸 Buying USDT at ₹92/$',
    '📤 Sending Crypto Fast',
    '📥 Receiving INR Securely',
    '🔁 Real-Time Exchange',
    '🪙 BTC, ETH, LTC, USDT Live!',
    '💳 Exchange 24x7 on GrandX',
    '⚡ Instant UPI Payments',
    '🎟️ Creating Exchange Tickets'
  ];

  let i = 0;
  setInterval(() => {
    client.user.setActivity(statuses[i], { type: 'WATCHING' });
    i = (i + 1) % statuses.length;
  }, 4000);
});

registerCommands(); // Call it on boot

// Keep-alive
const app = express();
app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(3000, () => console.log('✅ Keep-alive server running on port 3000'));

// Handle Interactions
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) await command.execute(interaction, client);
  }

  if (interaction.isStringSelectMenu()) {
    require('./handlers/dropdownHandler')(interaction, client);
  }

  if (interaction.isModalSubmit()) {
    require('./handlers/modalHandler')(interaction, client);
  }

  if (interaction.isButton()) {
    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    const log = messages.map(msg => `[${msg.author.tag}]: ${msg.content}`).reverse().join('\n');
    const buffer = Buffer.from(log, 'utf-8');
    const file = { attachment: buffer, name: `transcript-${interaction.channel.name}.txt` };

    const isDelivered = interaction.customId === 'mark_delivered';
    const logChannelId = isDelivered ? '1370081787501613066' : '1357307691487334542';
    const logChannel = await interaction.guild.channels.fetch(logChannelId);

    await logChannel.send({ content: `Transcript for ${interaction.channel.name}`, files: [file] });
    await interaction.reply({ content: `Ticket has been closed and transcript saved.`, ephemeral: true });
    await interaction.channel.delete();
  }
});

client.login(process.env.DISCORD_TOKEN);
