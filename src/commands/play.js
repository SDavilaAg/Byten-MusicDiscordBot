const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('@distube/ytdl-core');
const musicPlayer = require('../music/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('YouTube video URL')
        .setRequired(true)),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ content: '❌ You must be in a voice channel to use this command.', ephemeral: true });
    }

    const url = interaction.options.getString('url');
    if (!ytdl.validateURL(url)) {
      return interaction.reply({ content: '❌ Please enter a valid YouTube URL.', ephemeral: true });
    }

    try {
      await musicPlayer.joinChannel(voiceChannel);

      const stream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
      });

      musicPlayer.playStream({ stream, url });

      const info = await ytdl.getInfo(url);
      await interaction.reply(`🎶 Now playing: **${info.videoDetails.title}**`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '⚠️ Failed to play the song.', ephemeral: true });
    }
  },
};
