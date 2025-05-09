const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (interaction, client) => {
  const userId = interaction.user.id;
  const selections = client.tempSelections?.[userId];
  if (!selections) return;

  const amount = interaction.fields.getTextInputValue('amount');
  const ticketName = `ticket-${selections.type === 'INR to Crypto' ? 'i2c' : 'c2i'}-${interaction.user.username}`.toLowerCase();

  const channel = await interaction.guild.channels.create({
    name: ticketName,
    type: ChannelType.GuildText,
    parent: process.env.CATEGORY_ID,
    permissionOverwrites: [
      { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
      { id: process.env.STAFF_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
    ]
  });

  const embed = new EmbedBuilder()
    .setTitle('🎟️ New Exchange Ticket')
    .setColor('#e600f8')
    .setDescription(`• **User:** <@${interaction.user.id}>\n• **Exchange Type:** ${selections.type}\n• **Selected:** ${selections.value.toUpperCase()}\n• **Amount:** ${amount}`)
    .setFooter({ text: 'GrandX Exchange Bot' });

  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('mark_delivered')
      .setLabel('✅ Mark as Delivered')
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('❌ Close Ticket')
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({
    content: `<@&${process.env.STAFF_ROLE_ID}>`,
    embeds: [embed],
    components: [buttonRow]
  });

  await interaction.reply({ content: `✅ Ticket created: <#${channel.id}>`, ephemeral: true });
};
