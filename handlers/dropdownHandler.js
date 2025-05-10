const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = async (interaction, client) => {
  const userId = interaction.user.id;

  let typeLabel;
  if (interaction.values[0] === 'i2c') typeLabel = 'INR ➜ Crypto';
  else if (interaction.values[0] === 'c2i') typeLabel = 'Crypto ➜ INR';

  if (!client.tempSelections) client.tempSelections = {};
  client.tempSelections[userId] = { type: typeLabel };

  const modal = new ModalBuilder()
    .setCustomId('exchange_modal')
    .setTitle(typeLabel === 'INR ➜ Crypto' ? 'Select Crypto & Enter Amount' : 'Select UPI & Enter Amount');

  const methodInput = new TextInputBuilder()
    .setCustomId('method')
    .setLabel(typeLabel === 'INR ➜ Crypto' ? 'Which crypto? (e.g., USDT)' : 'Which UPI app? (e.g., PhonePe)')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const amountInput = new TextInputBuilder()
    .setCustomId('amount')
    .setLabel('Amount (INR/USD)')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(methodInput),
    new ActionRowBuilder().addComponents(amountInput)
  );

  await interaction.showModal(modal);
};
