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
      .setColor('#ffffff') // White color
      .setThumbnail('https://raw.githubusercontent.com/CodingWithCrystaL/Exchange/refs/heads/main/97BF9134-C91D-442D-8F09-74FD08C3C379.png')
      .setDescription(
        `**__INR TO CRYPTO__**\n` +
        `> <:emoji_23:1370473294448558210> **Any Amount** = ₹90/$\n\n` +
        `**__CRYPTO TO INR__**\n` +
        `> <:emoji_25:1370476212656537822> **Any Amount** = ₹85/$\n\n` +
        `**__RULES & GUIDELINES__**\n` +
        `> ❌ **Do not DM staff directly**\n` +
        `> ⚠️ **No negotiations or rate changes**\n` +
        `> 🔐 **Use only bot-created tickets**\n` +
        `> ✅ **Confirm payment before closing**`
      )
      .setImage('https://raw.githubusercontent.com/CodingWithCrystaL/Exchange/refs/heads/main/IMG_1574.jpeg')
      .setFooter({ text: 'Dior Exchanges' });

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
