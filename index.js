const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

// 🎯 cria o bot
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

// 👤 usuários permitidos
const allowedUsers = [
  "783822938934607922",
  "968663196615471145",
  "878046149754355732",
  "1421337058311409696"
];

// 🔍 Tenta encontrar o arquivo de áudio
const POSSIBLE_AUDIO_FILES = ["audio", "audio.mp3", "audio.ogg"];
let AUDIO_FILE = null;

for (const file of POSSIBLE_AUDIO_FILES) {
  if (fs.existsSync(`./${file}`)) {
    AUDIO_FILE = `./${file}`;
    console.log(`✅ Áudio encontrado: ${AUDIO_FILE}`);
    break;
  }
}

if (!AUDIO_FILE) {
  console.error("❌ Nenhum arquivo de áudio encontrado! Certifique-se de ter audio.mp3, audio.wav ou audio.");
}

// ✅ quando o bot conectar
client.once('ready', () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);
});

// 🎤 evento quando alguém entra em call
client.on('voiceStateUpdate', (oldState, newState) => {
  if (!oldState.channel && newState.channel) {
    const userId = newState.id;

    if (allowedUsers.includes(userId) && AUDIO_FILE) {
      try {
        console.log(`🎧 Usuário autorizado entrou: ${userId}`);

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
          console.log("🔇 Áudio finalizado, saindo...");
          connection.destroy();
        });

      } catch (err) {
        console.error('❌ Erro ao tocar áudio:', err);
      }
    }
  }
});

// 🔥 LOGIN
(async () => {
  try {
    console.log("🚀 Tentando logar no Discord...");
    await client.login(process.env.TOKEN);
  } catch (err) {
    console.error("💥 ERRO REAL AO LOGAR:", err);
  }
})();

// 🌐 servidor fake (necessário no Replit)
require('http')
  .createServer((req, res) => res.end('Bot rodando'))
  .listen(process.env.PORT || 3000);