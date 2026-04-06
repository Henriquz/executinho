const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// 🎯 Lista dos usuários permitidos
const allowedUsers = [
  "783822938934607922",
  "968663196615471145",
  "878046149754355732"
];

const AUDIO_FILE = "./audio.mp3";

client.once('ready', () => {
  console.log(`Bot logado como ${client.user.tag}`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
  // entrou no canal
  if (!oldState.channel && newState.channel) {
    const userId = newState.id;

    if (allowedUsers.includes(userId)) {
      try {
        const connection = joinVoiceChannel({
          channelId: newState.channel.id,
          guildId: newState.guild.id,
          adapterCreator: newState.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(AUDIO_FILE);

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
        });

      } catch (err) {
        console.error('Erro ao tocar áudio:', err);
      }
    }
  }
});

client.login(process.env.TOKEN);