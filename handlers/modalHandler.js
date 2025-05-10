module.exports = async (interaction, client) => {
  const userId = interaction.user.id;
  const method = interaction.fields.getTextInputValue('method');
  const amount = interaction.fields.getTextInputValue('amount');

  if (!client.tempSelections) client.tempSelections = {};
  if (!client.tempSelections[userId]) client.tempSelections[userId] = {};
  client.tempSelections[userId].value = method;
  client.tempSelections[userId].amount = amount;

  const ticketChannel = await interaction.guild.channels.create({
    name: `exchange-${userId}`,
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

  await ticketChannel.send({
    content: `📩 <@${userId}> Your exchange ticket has been created.\nOur staff will assist you shortly.`
  });

  await interaction.reply({
    content: `✅ Your ticket has been opened: <#${ticketChannel.id}>`,
    ephemeral: true
  });
};
