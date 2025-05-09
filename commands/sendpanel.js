const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendpanel')
    .setDescription('Send exchange panel for users to open tickets'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🛒 **GRANDX EXCHANGE PANEL** 🛒')
      .setColor('#e600f8')
      .setDescription(
        `**__INR TO CRYPTO__**\n` +
        `> <:emoji_23:1370473294448558210> **₹92 per $ (Any Amount)**\n\n` +
        `**__CRYPTO TO INR__**\n` +
        `> <:emoji_25:1370476212656537822> **Below $50** = ₹86.5/$\n` +
        `> <:emoji_25:1370476212656537822> **$50–$150** = ₹87/$\n` +
        `> <:emoji_25:1370476212656537822> **Above $150** = ₹87.5/$`
      )
      .setFooter({ text: 'GrandX Exchange Bot | Powered by Kai' });

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
