const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendaddress')
    .setDescription('Send one specific payment address in this ticket')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Select the address to send')
        .setRequired(true)
        .addChoices(
          { name: 'USDT TRC20', value: 'usdt_trc20' },
          { name: 'USDT Polygon', value: 'usdt_polygon' },
          { name: 'LTC (LTC Network)', value: 'ltc' },
          { name: 'UPI (payishant@fam)', value: 'upi' }
        )
    ),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (!member.roles.cache.has(staffRoleId)) {
      return interaction.reply({ content: '❌ Only staff can use this command.', ephemeral: true });
    }

    const type = interaction.options.getString('type');
    const addressMap = {
      usdt_trc20: { label: 'USDT TRC20', value: 'TCgaBsn5HnsZVTsrgd4smVyqdF7pDrYLok' },
      usdt_polygon: { label: 'USDT Polygon', value: '0x1DC2Fdd9Cc33ce107505aA81f1cb4811949ECAAF' },
      ltc: { label: 'LTC (LTC Network)', value: 'ltc1qr354v0qe2mja3rq423g4x80m3lxwcf0vfp5mcv' },
      upi: { label: 'UPI (payishant@fam)', value: 'payishant@fam' }
    };

    const selected = addressMap[type];

    const embed = new EmbedBuilder()
      .setTitle('💳 Payment Method')
      .setColor('#ffffff')
      .setDescription(`**${selected.label}**\n\`${selected.value}\``)
      .setFooter({ text: 'Dior Exchange' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`copy_${type}`)
        .setLabel('📋 Copy Address')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
