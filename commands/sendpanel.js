const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendpanel')
    .setDescription('Send exchange panel for users to open tickets'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('<:emoji_24:1370474663821447361> GRANDX EXCHANGE PANEL <:emoji_24:1370474663821447361>')
      .setColor('#e600f8')
      .setDescription(`**INR TO CRYPTO**:\n<:emoji_23:1370473294448558210> Any Amount = ₹92/$\n\n**CRYPTO TO INR**:\n<:emoji_25:1370476212656537822> Below $50 = ₹86.5/$\n<:emoji_25:1370476212656537822> $50–$150 = ₹87/$\n<:emoji_25:1370476212656537822> Above $150 = ₹87.5/$\n\nPROCEED TO EXCHANGE:`);

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_type')
        .setPlaceholder('PROCEED TO EXCHANGE')
        .addOptions([
          {
            label: 'INR to Crypto',
            value: 'i2c',
            emoji: '<:emoji_23:1370473294448558210>',
          },
          {
            label: 'Crypto to INR',
            value: 'c2i',
            emoji: '<:emoji_25:1370476212656537822>',
          }
        ])
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
