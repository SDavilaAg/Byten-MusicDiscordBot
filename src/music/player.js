const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

class MusicPlayer {
  constructor() {
    this.connection = null;
    this.player = createAudioPlayer();
    this.currentResource = null;
    this.currentUrl = null; // 🔁 Guardar la URL para poder recrear el stream
    this.isLooping = false;

    this.player.on(AudioPlayerStatus.Idle, async () => {
      if (this.isLooping && this.currentUrl) {
        try {
          const stream = ytdl(this.currentUrl, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
          });
          const resource = createAudioResource(stream, {
            inputType: StreamType.Arbitrary,
          });
          this.currentResource = resource;
          this.player.play(resource);
        } catch (err) {
          console.error('Error while looping song:', err);
        }
      } else {
        if (this.connection) {
          setTimeout(() => {
            if (this.player.state.status === AudioPlayerStatus.Idle) {
              this.connection.destroy();
              this.connection = null;
            }
          }, 1000);
        }
      }
    });

    this.player.on('error', error => {
      console.error('Audio player error:', error);
      if (this.connection) {
        this.connection.destroy();
        this.connection = null;
      }
    });
  }

  async joinChannel(voiceChannel) {
    if (this.connection) {
      if (this.connection.joinConfig.channelId === voiceChannel.id) return;
      this.connection.destroy();
      this.connection = null;
    }

    this.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    this.connection.subscribe(this.player);

    this.connection.on('stateChange', (oldState, newState) => {
      if (newState.status === 'disconnected') {
        this.connection.destroy();
        this.connection = null;
      }
    });
  }

  playStream({ stream, url }) {
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary, // For ytdl-core compatibility
    });
    this.currentResource = resource;
    this.currentUrl = url; // 🔁 Guardar URL actual
    this.player.play(resource);
  }

  stop() {
    this.player.stop();
    if (this.connection) {
      this.connection.destroy();
      this.connection = null;
    }
    this.currentResource = null;
    this.currentUrl = null;
  }

  toggleLoop() {
    this.isLooping = !this.isLooping;
    return this.isLooping;
  }
}

module.exports = new MusicPlayer();
