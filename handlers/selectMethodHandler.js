const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = async (interaction, client) => {
  const userId = interaction.user.id;
  const method = interaction.values[0];

  if (!client.tempSelections) client.tempSelections = {};
  if (!client.tempSelections[userId]) client.tempSelections[userId] = {};
  client.tempSelections[userId].value = method;

  const modal = new ModalBuilder()
    .setCustomId('exchange_modal')
    .setTitle('Enter Exchange Amount');

  const amountInput = new TextInputBuilder()
    .setCustomId('amount')
    .setLabel('Amount in INR or USD')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder().addComponents(amountInput));

  await interaction.showModal(modal);
};
