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
    .setColor('#ffffff')
    .setThumbnail('https://raw.githubusercontent.com/CodingWithCrystaL/Exchange/refs/heads/main/97BF9134-C91D-442D-8F09-74FD08C3C379.png')
    .setImage('https://raw.githubusercontent.com/CodingWithCrystaL/Exchange/refs/heads/main/IMG_1574.jpeg')
    .setDescription(
      `**• User:** <@${userId}>\n` +
      `**• Type:** ${type}\n` +
      `**• Selected:** ${value}\n` +
      `**• Amount:** ₹${amount}\n\n` +
      `> ⚠️ Please wait while our staff assist you.\n` +
      `> ❌ Do **not** DM anyone directly.\n` +
      `> ✅ Provide payment proof when asked.`
    )
    .setFooter({ text: 'Dior Exchange Bot' })
    .setTimestamp();

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
