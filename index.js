// index.js
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  REST,
  Routes
} = require('discord.js');
const fs = require('fs');
const express = require('express');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const registerCommands = async () => {
  const commands = client.commands.map(cmd => cmd.data.toJSON());
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    await rest.put(Routes.applicationCommands('1370527419202801746'), { body: commands });
    console.log('✅ Slash commands registered globally!');
  } catch (err) {
    console.error('❌ Slash command registration failed:', err);
  }
};

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
    client.user.setPresence({
      activities: [{ name: statuses[i], type: 3 }],
      status: 'online'
    });
    i = (i + 1) % statuses.length;
  }, 4000);
});

registerCommands();

const app = express();
app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(3000, () => console.log('✅ Keep-alive server running on port 3000'));

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
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const isStaff = member.roles.cache.has(process.env.STAFF_ROLE_ID);
    const user = interaction.user;

    if (!isStaff) {
      return interaction.reply({ content: '❌ You do not have permission to close or deliver this ticket.', ephemeral: true });
    }

    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    const log = messages.map(msg => `[${msg.author.tag}]: ${msg.content}`).reverse().join('\n');
    const buffer = Buffer.from(log, 'utf-8');
    const file = { attachment: buffer, name: `transcript-${interaction.channel.name}.txt` };

    const isDelivered = interaction.customId === 'mark_delivered';
    const logChannelId = isDelivered ? '1370081787501613066' : '1357307691487334542';
    const logChannel = await interaction.guild.channels.fetch(logChannelId);
    await logChannel.send({ content: `📄 Transcript for ${interaction.channel.name}`, files: [file] });

    if (isDelivered) {
      const openerId = interaction.channel.name.split('-').pop();
      const memberToUpdate = await interaction.guild.members.fetch(openerId).catch(() => null);
      const selection = client.tempSelections?.[openerId];

      if (memberToUpdate) {
        await memberToUpdate.roles.add('1357307449366937700');
      }

      const summaryEmbed = new EmbedBuilder()
        .setTitle('✅ Exchange Completed')
        .setColor('#a020f0')
        .setThumbnail('https://raw.githubusercontent.com/CodingWithCrystaL/Exchange/refs/heads/main/F8A11032-91DF-4076-91D8-247F1AF998C9.png')
        .setDescription(
          `**• User:** <@${openerId}>\n` +
          `**• Type:** ${selection?.type || 'N/A'}\n` +
          `**• Selected:** ${selection?.value?.toUpperCase() || 'N/A'}\n` +
          `**• Amount:** ₹${selection?.amount || 'N/A'}\n` +
          `**• Delivered By:** <@${interaction.user.id}>`
        )
        .setFooter({ text: 'GrandX Exchange Bot | Powered by Kai' });

      const exchangeLogChannel = await interaction.guild.channels.fetch('1361748424277627215');
      await exchangeLogChannel.send({ embeds: [summaryEmbed] });
    }

    try {
      await user.send('✅ **Thank you for using GrandX Exchange!**\nIf you have any feedback or need help, feel free to open a support ticket.');
    } catch (e) {
      console.log(`❌ Could not DM ${user.tag}`);
    }

    await interaction.reply({ content: '✅ Ticket closed. Transcript saved.', ephemeral: true });
    await interaction.channel.delete();
  }
});

client.login(process.env.DISCORD_TOKEN);
