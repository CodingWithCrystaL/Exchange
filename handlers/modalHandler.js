const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

let ticketCount = 1;

module.exports = async (interaction, client) => {
  const userId = interaction.user.id;
  const username = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '');
  const amount = interaction.fields.getTextInputValue('amount');

  if (!client.tempSelections) client.tempSelections = {};
  if (!client.tempSelections[userId]) client.tempSelections[userId] = {};

  client.tempSelections[userId].amount = amount;

  const { type, value, code } = client.tempSelections[userId];
  const ticketName = `${code}-${username}-${String(ticketCount).padStart(3, '0')}`;
  ticketCount++;

  const ticketChannel = await interaction.guild.channels.create({
    name: ticketName,
    type: 0,
    parent: process.env.CATEGORY_ID,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone,
        deny: ['ViewChannel']
      },
      {
        id: userId,
        allow: ['ViewChannel', 'SendMessages']
      },
      {
        id: process.env.STAFF_ROLE_ID,
        allow: ['ViewChannel', 'SendMessages']
      }
    ]
  });

  const embed = new EmbedBuilder()
    .setTitle('🎟️ Exchange Ticket Created')
    .setColor('#a020f0')
    .setThumbnail('https://raw.githubusercontent.com/CodingWithCrystaL/Exchange/refs/heads/main/F8A11032-91DF-4076-91D8-247F1AF998C9.png')
    .setDescription(
      `**• User:** <@${userId}>\n` +
      `**• Type:** ${type}\n` +
      `**• Selected:** ${value}\n` +
      `**• Amount:** ₹${amount}\n\n` +
      `> ⚠️ Please wait while our staff assist you.\n` +
      `> ❌ Do **not** DM anyone directly.\n` +
      `> ✅ Provide payment proof when asked.`
    )
    .setFooter({ text: 'GrandX Exchange Bot | Powered by Kai' });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('mark_delivered')
      .setLabel('✅ Mark as Delivered')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('❌ Close Ticket')
      .setStyle(ButtonStyle.Danger)
  );

  await ticketChannel.send({
    content: `<@&${process.env.STAFF_ROLE_ID}>`,
    embeds: [embed],
    components: [row]
  });

  await interaction.reply({
    content: `✅ Your ticket has been opened: <#${ticketChannel.id}>`,
    ephemeral: true
  });
};
