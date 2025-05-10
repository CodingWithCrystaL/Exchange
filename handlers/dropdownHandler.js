const {
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

module.exports = async (interaction, client) => {
  const userId = interaction.user.id;
  const selected = interaction.values[0];

  const type = selected === 'i2c' ? 'INR ➜ Crypto' : 'Crypto ➜ INR';

  if (!client.tempSelections) client.tempSelections = {};
  client.tempSelections[userId] = { type, code: selected };

  const cryptoOptions = [
    { label: 'USDT', value: 'USDT', emoji: { id: '1368038168275714099', name: 'emoji_7' } },
    { label: 'BTC', value: 'BTC', emoji: { id: '1368036273746608198', name: 'emoji_3' } },
    { label: 'ETH', value: 'ETH', emoji: { id: '1368036193001799780', name: 'emoji_1' } },
    { label: 'LTC', value: 'LTC', emoji: { id: '1368036325525295145', name: 'emoji_4' } },
    { label: 'Other', value: 'Other', emoji: { id: '1368036924798926868', name: 'emoji_6' } }
  ];

  const upiOptions = [
    { label: 'PhonePe', value: 'PhonePe', emoji: { id: '1370526321037545562', name: 'emoji_26' } },
    { label: 'Paytm', value: 'Paytm', emoji: { id: '1370526361407459328', name: 'emoji_27' } },
    { label: 'Fampay', value: 'Fampay', emoji: { id: '1368038254191968256', name: 'emoji_11' } },
    { label: 'GPay', value: 'GPay', emoji: { id: '1368036924798926868', name: 'emoji_6' } },
    { label: 'Other', value: 'Other', emoji: { id: '1368036924798926868', name: 'emoji_6' } }
  ];

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select_type_method')
      .setPlaceholder('Select a method')
      .addOptions(selected === 'i2c' ? cryptoOptions : upiOptions)
  );

  await interaction.reply({
    content: `**Please select your ${type === 'INR ➜ Crypto' ? 'Crypto' : 'UPI'} method:**`,
    components: [row],
    ephemeral: true
  });
};
