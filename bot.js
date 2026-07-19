const mineflayer = require('mineflayer');
const express = require('express');

// --- 7/24 Açık Kalması İçin Web Sunucusu ---
const app = express();
app.get('/', (req, res) => res.send('Bot şu anda aktif ve çalışıyor!'));
app.listen(process.env.PORT || 3000, () => console.log('[WEB] Uptime sunucusu başlatıldı.'));
// -------------------------------------------

const OPTIONS = {
    host: 'LegacyNetwork.enderman.cloud', // Sunucu IP
    username: 'LegacyNWBot',              // Botun ismi
    version: false                       // Sürümü otomatik algıla
};

function createBot() {
    console.log('[BOT] Sunucuya bağlanılıyor: ' + OPTIONS.host);
    const bot = mineflayer.createBot(OPTIONS);

    bot.on('spawn', () => {
        console.log('[BOT] Sunucuya başarıyla giriş yapıldı!');
        
        // Sunucuya giriş yapınca biraz bekleyip giriş komutlarını at
        setTimeout(() => {
            console.log('[BOT] Kayıt olma ve Giriş yapma komutları gönderiliyor...');
            
            // İlk kez giriyorsa diye register komutu
            bot.chat('/register legacy123 legacy123');
            
            // Sonraki girişler için login komutu (İkisi de peş peşe atılır, hangisi lazımsa o çalışır)
            setTimeout(() => {
                bot.chat('/login legacy123');
            }, 1000); // 1 saniye sonra login at
            
        }, 3000); // Spawn olduktan 3 saniye sonra başla
    });

    bot.on('error', err => {
        console.log('[HATA] Bir hata oluştu: ' + err.message);
    });

    bot.on('end', () => {
        console.log('[BOT] Sunucudan koptu! 10 saniye içinde tekrar bağlanılıyor...');
        // Bot kapanırsa veya sunucudan atılırsa 10 saniye sonra tekrar bağlan
        setTimeout(createBot, 10000);
    });
    
    bot.on('kicked', (reason) => {
        console.log('[BOT] Sunucudan atıldı, sebep: ' + reason);
    });
}

createBot();
