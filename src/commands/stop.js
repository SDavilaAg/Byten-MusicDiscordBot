const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../music/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playing and leave the voice channel'),
  
  async execute(interaction) {
    if (!musicPlayer.connection) {
      return interaction.reply({ content: '❌ No estoy reproduciendo nada.', ephemeral: true });
    }

    musicPlayer.stop();
    return interaction.reply('🛑 Reproducción detenida y desconectado del canal de voz.');
  },
};
