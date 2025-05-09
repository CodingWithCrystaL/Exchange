const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = async (interaction, client) => {
  if (interaction.customId === 'select_type') {
    const type = interaction.values[0];

    if (type === 'i2c') {
      const embed = new EmbedBuilder()
        .setTitle('🎀 Exchange Setup: INR ➜ Crypto')
        .setColor('#e600f8')
        .setDescription('Choose the cryptocurrency you want to receive:');

      const cryptoRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select_crypto')
          .setPlaceholder('Select Crypto')
          .addOptions([
            { label: 'USDT', value: 'usdt', emoji: '<:emoji_7:1368038168275714099>' },
            { label: 'BTC', value: 'btc', emoji: '<:emoji_3:1368036273746608198>' },
            { label: 'LTC', value: 'ltc', emoji: '<:emoji_4:1368036325525295145>' },
            { label: 'ETH', value: 'eth', emoji: '<:emoji_1:1368036193001799780>' },
            { label: 'Other', value: 'other_crypto', emoji: '💠' }
          ])
      );

      await interaction.reply({ embeds: [embed], components: [cryptoRow], ephemeral: true });
    }

    if (type === 'c2i') {
      const embed = new EmbedBuilder()
        .setTitle('🎀 Exchange Setup: Crypto ➜ INR')
        .setColor('#e600f8')
        .setDescription('Choose your preferred UPI app to receive payment:');

      const upiRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select_upi')
          .setPlaceholder('Select UPI App')
          .addOptions([
            { label: 'PhonePe', value: 'phonepe', emoji: '<:emoji_26:1370526321037545562>' },
            { label: 'GPay', value: 'gpay', emoji: '<:emoji_6:1368036924798926868>' },
            { label: 'Paytm', value: 'paytm', emoji: '<:emoji_27:1370526361407459328>' },
            { label: 'Fampay', value: 'fampay', emoji: '<:emoji_11:1368038254191968256>' },
            { label: 'Other UPI', value: 'other_upi', emoji: '🔄' }
          ])
      );

      await interaction.reply({ embeds: [embed], components: [upiRow], ephemeral: true });
    }
  }

  if (interaction.customId === 'select_crypto' || interaction.customId === 'select_upi') {
    const value = interaction.values[0];
    const type = interaction.customId === 'select_crypto' ? 'INR to Crypto' : 'Crypto to INR';

    const modal = new ModalBuilder()
      .setCustomId(`amount_modal_${type === 'INR to Crypto' ? 'i2c' : 'c2i'}`)
      .setTitle('Enter Exchange Amount');

    const amountInput = new TextInputBuilder()
      .setCustomId('amount')
      .setLabel(`Enter amount in ${type === 'INR to Crypto' ? 'INR' : 'USDT'}`)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(amountInput);
    modal.addComponents(row);

    await interaction.showModal(modal);

    client.tempSelections = client.tempSelections || {};
    client.tempSelections[interaction.user.id] = { type, value };
  }
};
