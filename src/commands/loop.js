const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../music/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Toggle looping the current song'),

  async execute(interaction) {
    if (!musicPlayer.currentResource) {
      return interaction.reply({ content: 'No song is currently playing.', ephemeral: true });
    }
    const looping = musicPlayer.toggleLoop();
    return interaction.reply(looping ? '🔁 Looping enabled.' : '▶️ Looping disabled.');
  },
};
