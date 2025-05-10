const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendpanel')
    .setDescription('Send exchange panel for users to open tickets'),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: '❌ Only staff can use this command.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('🛒 **GRANDX EXCHANGE PANEL** 🛒')
      .setColor('#e600f8')
      .setThumbnail('https://raw.githubusercontent.com/CodingWithCrystaL/Exchange/refs/heads/main/F8A11032-91DF-4076-91D8-247F1AF998C9.png')
      .setDescription(
        `**__INR TO CRYPTO__**\n` +
        `> <:emoji_23:1370473294448558210> **₹91 per $ (Any Amount)**\n\n` +
        `**__CRYPTO TO INR__**\n` +
        `> <:emoji_25:1370476212656537822> **Below $50** = ₹86.5/$\n` +
        `> <:emoji_25:1370476212656537822> **$50–$150** = ₹87/$\n` +
        `> <:emoji_25:1370476212656537822> **Above $150** = ₹87.5/$\n\n` +
        `**__RULES & GUIDELINES__**\n` +
        `> ❌ **Do not DM staff directly**\n` +
        `> ⚠️ **No negotiations or rate changes**\n` +
        `> 🔐 **Use only bot-created tickets**\n` +
        `> ✅ **Confirm payment before closing**`
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
            emoji: { id: '1370473294448558210', name: 'emoji_23' }
          },
          {
            label: 'Crypto to INR',
            value: 'c2i',
            emoji: { id: '1370476212656537822', name: 'emoji_25' }
          }
        ])
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
