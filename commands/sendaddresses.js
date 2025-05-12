const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendaddress')
    .setDescription('Send a specific crypto or UPI payment address')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Select which address to send')
        .setRequired(true)
        .addChoices(
          { name: 'USDT TRC20', value: 'usdt_trc20' },
          { name: 'USDT Polygon', value: 'usdt_polygon' },
          { name: 'LTC (LTC Network)', value: 'ltc' },
          { name: 'UPI', value: 'upi' }
        )
    ),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (!member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: '❌ Only staff can use this command.', ephemeral: true });
    }

    const type = interaction.options.getString('type');
    let label = '';
    let address = '';

    switch (type) {
      case 'usdt_trc20':
        label = 'USDT TRC20';
        address = 'TCgaBsn5HnsZVTsrgd4smVyqdF7pDrYLok';
        break;
      case 'usdt_polygon':
        label = 'USDT Polygon';
        address = '0x1DC2Fdd9Cc33ce107505aA81f1cb4811949ECAAF';
        break;
      case 'ltc':
        label = 'LTC (LTC Network)';
        address = 'ltc1qr354v0qe2mja3rq423g4x80m3lxwcf0vfp5mcv';
        break;
      case 'upi':
        label = 'UPI';
        address = 'payishant@fam';
        break;
    }

    const embed = new EmbedBuilder()
      .setTitle('💳 Payment Method')
      .setColor('#a020f0')
      .setDescription(`**${label}**\n\`${address}\``)
      .setFooter({ text: 'GrandX Exchange | Powered by Kai' });

    await interaction.reply({ embeds: [embed] });
  }
};
