const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendaddresses')
    .setDescription('Send crypto and UPI payment addresses in the ticket'),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: '❌ Only staff can use this command.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('💳 Payment Details for This Exchange')
      .setColor('#a020f0')
      .setDescription(
        `**Crypto Addresses:**\n` +
        `• **USDT TRC20:** \`TCgaBsn5HnsZVTsrgd4smVyqdF7pDrYLok\`\n` +
        `• **USDT Polygon:** \`0x1DC2Fdd9Cc33ce107505aA81f1cb4811949ECAAF\`\n` +
        `• **LTC (LTC Network):** \`ltc1qr354v0qe2mja3rq423g4x80m3lxwcf0vfp5mcv\`\n\n` +
        `**UPI Address:** \`payishant@fam\``
      )
      .setFooter({ text: 'GrandX Exchange | Powered by Kai' });

    await interaction.reply({ embeds: [embed] });
  }
};
