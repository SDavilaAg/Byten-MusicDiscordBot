const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../music/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the currently playing song'),
  
  async execute(interaction) {
    if (!musicPlayer.connection) {
      return interaction.reply({ content: '❌ No estoy conectado a ningún canal de voz.', ephemeral: true });
    }

    if (musicPlayer.player.state.status === 'idle') {
      return interaction.reply({ content: '❌ No hay ninguna canción sonando para saltar.', ephemeral: true });
    }

    musicPlayer.stop();
    return interaction.reply('⏭️ Canción saltada!');
  },
};
