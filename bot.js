const mineflayer = require('mineflayer');
const express = require('express');

// --- 7/24 Açık Kalması İçin Web Sunucusu ---
const app = express();
app.get('/', (req, res) => res.send('Bot şu anda aktif ve çalışıyor!'));
app.listen(process.env.PORT || 3000, () => console.log('[WEB] Uptime sunucusu başlatıldı.'));
// -------------------------------------------

const OPTIONS = {
    host: 'legacynw.duckdns.org', // Sunucu IP
    port: 6630,                   // <-- İŞTE BU SATIRI EKLE VEYA 6630 YAP!
    username: 'LegacyNWBot',              // Botun ismi
    version: false                       // Sürümü otomatik algıla
};

function createBot() {
    console.log('[BOT] Sunucuya bağlanılıyor: ' + OPTIONS.host);
    const bot = mineflayer.createBot(OPTIONS);

    let hasAuthenticated = false;

    bot.on('spawn', () => {
        console.log('[BOT] Sunucuya başarıyla giriş yapıldı!');
        hasAuthenticated = false; // Yeniden doğduğunda sıfırla
    });

    // Kayıt ve Giriş İşlemleri (Skript/AuthMe) - Gelen mesaja göre akıllı tepki
    bot.on('message', (message) => {
        const msg = message.toString().toLowerCase();
        
        // Eğer zaten giriş/kayıt işlemi yaptıysa, chat'ten gelen yazıları görmezden gel
        if (hasAuthenticated) return;
        
        // Sunucu "register" veya "kayıt" kelimesi içeren bir yazı yollarsa:
        if (msg.includes('/register') || msg.includes('kayit') || msg.includes('kayıt')) {
            hasAuthenticated = true;
            setTimeout(() => {
                bot.chat('/register babapro babapro');
                console.log('[AUTH] Sunucunun isteği üzerine Kayıt olundu.');
            }, 1000);
        } 
        // Sunucu "login" veya "şifre" kelimesi içeren bir yazı yollarsa:
        else if (msg.includes('/login') || msg.includes('sifre') || msg.includes('şifre') || msg.includes('giris') || msg.includes('giriş')) {
            hasAuthenticated = true;
            setTimeout(() => {
                bot.chat('/login babapro');
                console.log('[AUTH] Sunucunun isteği üzerine Giriş yapıldı.');
            }, 1000);
        }
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
