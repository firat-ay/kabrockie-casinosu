const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");
let money = require('./money.json');

const PREFIX = '!';

// BAR FİYATLARI /////////
const vodkaFiyat = 10;
const biraFiyat = 5;
const tekilaFiyat = 25;
const kirmiziFiyat = 50;
const beyazFiyat = 50;
const sampanyaFiyat = 150;
//////////////////////////
// YARIŞÇILAR ////////////
const racerArray = [{ name: "Paul Walker", car: "Nissan Skyline GTR R-34", betMin: 1, betMax: 3, betTotal: 0 },
{ name: "Vin Diesel", car: "1970 Dodge Charger", betMin: 1, betMax: 3, betTotal: 0 },
{ name: "Ryan Cooper", car: "Nissan 240SX", betMin: 3, betMax: 5, betTotal: 0 },
{ name: "Razor", car: "BMW M3 GTR", betMin: 4, betMax: 7, betTotal: 0 },
{ name: "Br0Li SeDa", car: "Dodge Neon", betMin: 5, betMax: 8, betTotal: 0 },
{ name: "İsmail Yazar", car: "Cornetto", betMin: 10, betMax: 30, betTotal: 0 }];


const mafya = ["124978058212933633", "151362659017555968", "569437611186323456", "277059088754671618", "293083992457084929", "525000563515981825", "280074816906592256", "195483921293639680"]


function randomNumber() {
    return Math.random();
}

function isNumeric(num) {
    return !isNaN(num)
}


bot.on('ready', () => {
    bot.user.setStatus('available')
    bot.user.setPresence({
        game: {
            name: '!yardım',
            type: "PLAYING"
        }
    });
    //bot.guilds.get('588434226488279052').channels.get('607912313240027145').send("Gazinomuz açıktır.");
    console.log('Ready!');
})


bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    if (message.channel.id !== '607912313240027145' && message.guild.id !== '608344137305030667') {
        return;
    }


    // Bakiye 0 olunca claim
    if (args[0] === "claim") {

        if (!money[message.author.id]) {
            message.reply("gazinomuzda mevcut bir hesabınız yoktur. Lütfen önce !hesapaç komutu ile hesap açın.");
            return;
        }

        if (money[message.author.id].money > 0) {
            message.reply("bu komutu kullanabilmeniz için bakiyenizin 0$ olması gerekmektedir.");
            return;
        }

        money[message.author.id].money += 100;
        message.reply("bakiyenize 100$ yatmıştır.")
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });

        return;
    }

    // Admin komutları
    if (args[0] === "give") {
        if (message.author.id !== "298884333970784256") return (message.reply("bu komutu sadece gazino müdürümüz kullanabilir."));

        money[message.mentions.users.first().id].money += parseInt(args[1])
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        message.channel.send("Sayın <@" + message.mentions.users.first().id + ">, hesabınıza cömert gazino müdürümüz tarafından " + args[1] + "$ para aktarılmıştır. Bir daha batmamaya çalışın!")
        return;
    }

    if (args[0] === "sub") {
        if (message.author.id !== "298884333970784256") return (message.reply("bu komutu sadece gazino müdürümüz kullanabilir."));

        money[message.mentions.users.first().id].money -= parseInt(args[1])
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });

        return;
    }


    // mafya mı devlet mi ne olduğu belli olmayanlar tarafından zorla yazdırılan kod.
    // bunu okuyorsanız lütfen yardım edin
    if (args[0] === "vergi") {
        if (message.author.id !== "298884333970784256") return;
        var mentionID = message.mentions.users.first().id;
        var mafyaListesi = mafya;

        var thirtyFive = Math.floor(money[mentionID].money * 35 / 100); // paranın %35i hesaplanıyor
        money[mentionID].money -= thirtyFive;               // paranın %35i eksiliyor

        thirtyFive = thirtyFive / mafyaListesi.length;             // paranın %35i mod sayısına bölünüyor
        var taxCounter;

        for(taxCounter = 0; taxCounter < mafyaListesi.length; taxCounter++){
            if(!money[mafyaListesi[taxCounter]]){
                console.log(mafyaListesi[taxCounter] + " hesabı bulunamadı...")
            }
            else{
                money[mafyaListesi[taxCounter]].money += thirtyFive;
            }
        }
        

        message.channel.send("Sayın <@" + mentionID + "> , Kabrockia Gazinolar Yasası 1669 sayılı kanun gereğince bakiyenizin %35'ine vergi olarak Kabrockia devleti tarafından el konulmuştur. Şikayetiniz varsa lütfen kasaba başkanına veya moderatörlere iletin.");
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        return;
    }

    if(args[0] === "bakiyekontrol"){
        message.reply(money[args[1]].money)
    }

    /*
    if(args[0] === "date"){
        if(message.author.id !== "298884333970784256") return;

        money.commandDate = new Date();

        
        var t;
        for(t = 0; t < Object.keys(money).lenght; t++){
            money[Object.keys(money)[t]]["commandDate"] = new Date();
        }
        fs.writeFile("./money.json", JSON.stringify(money), (err) =>{
            if (err) console.log(err);
        });


        return;
    }*/

    // Para aktarma
    if (args[0] === "paraver") {
        if (!money[message.author.id]) {
            message.reply("gazinomuzda mevcut bir hesabınız yoktur. Lütfen önce !hesapaç komutu ile hesap açın.");
            return;
        }

        if (!message.mentions) {
            message.reply("lütfen geçerli birini mentionlayın.");
            return;
        }

        if (isNumeric(args[1]) === false) {
            message.reply("lütfen geçerli bir sayı girin.")
            return;
        }

        if (money[message.author.id].money < parseInt(args[1])) {
            message.reply("yeterli bakiyeniz bulunmamaktadır.")
            return;
        }
        if (money[message.author.id].money < 1) {
            message.reply("lütfen geçerli bir sayı girin.")
            return;
        }
        if (!money[message.mentions.users.first().id]) {
            message.reply("para aktarmak istediğiniz kişinin gazinomuzda bir hesabı bulunmamaktadır.")
            return;
        }

        money[message.author.id].money -= parseInt(args[1]);
        money[message.mentions.users.first().id].money += parseInt(args[1]);
        message.channel.send("Sayın <@" + message.mentions.users.first().id + "> , hesabınıza <@" + message.author.id + "> tarafından " + args[1] + "$ aktarılmıştır.")
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        return;
    }


    // Gazinoda daha önce hiç oynamamış oyuncular !hesapaç komutu ile yeni hesap açmalıdırlar.
    // İlk defa !hesapaç komutunu kullanan oyuncuların hesaplarına 1000$ para yatırılır.
    if (args[0] === "hesapaç") {
        if (!money[message.author.id]) {
            money[message.author.id] = {
                money: 1000,
                vip: false,
                playingBlackjack: false,
                playingRace: false,
                raceBetList: [0, 0, 0, 0, 0, 0],
                blackjackHand: [],
                blackjackDealerHand: [],
                commandDate: new Date()
            };
            message.reply("gazinomuza hoşgeldiniz. Başlangıç için hesabınıza 1000$ yatırılmıştır. !yardım ile gazinomuzun imkanlarına gözatabilirsiniz.");
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
            return;
        }
        message.reply("gazinomuzda zaten bir hesabınız mevcuttur.");
    }

    // Oyuncular bakiyelerinde ne kadar para olduğunu kontrol etmek için !bakiye yazabilirler.
    // Kişinin mevcut hesabı yoksa önce hesap açması gerektiği söylenir, hesabı varsa kaç parası olduğu yazılır.
    if (args[0] === "bakiye") {
        if (!money[message.author.id]) {
            message.reply("gazinomuzda mevcut bir hesabınız yoktur. Lütfen önce !hesapaç komutu ile hesap açın.");
            return;
        }
        message.reply("hesabınızda " + money[message.author.id].money + "$ mevcuttur.");
    }

    // Gazinoda bir adet bar da mevcuttur. Hesabı olan kişiler buradan çeşitli içkiler satın alabilirler.
    // İçkinin fiyatı kişinin bakiyesinden çıkarılır.
    // Kişinin yeterli bakiyesi yoksa hata mesajı ile karşılaşır.
    if (args[0] === "bar") {
        if (!money[message.author.id]) {
            message.reply("lütfen müessesemizin imkanlarından faydalanmak için !hesapaç komutu ile hesap açın.");
            return;
        }

        if (args[1] === "vodka") {
            if (money[message.author.id].money < vodkaFiyat) {
                message.reply("yeterli paranız bulunmamakta.")
                return;
            }
            message.reply("vodkanız hazır, buyrun efendim.", { files: ["https://i.hizliresim.com/VQ32YB.jpg"] });
            money[message.author.id].money = money[message.author.id].money - vodkaFiyat;
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });

        }
        else if (args[1] === "bira") {
            if (money[message.author.id].money < biraFiyat && mafya.includes(message.author.id) === false) {
                message.reply("yeterli paranız bulunmamakta.")
                return;
            }
            message.reply("biranız hazır, afiyet olsun.", { file: "https://i.hizliresim.com/dL747r.jpg" });

            if(mafya.includes(message.author.id) === true) return;

            money[message.author.id].money = money[message.author.id].money - biraFiyat;
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
        }
        else if (args[1] === "tekila") {
            if (money[message.author.id].money < tekilaFiyat  && mafya.includes(message.author.id) === false) {
                message.reply("yeterli paranız bulunmamakta.")
                return;
            }
            message.reply("buyrunuz.", { files: ["https://i.hizliresim.com/od6nXq.jpg"] });

            if(mafya.includes(message.author.id) === true) return;

            money[message.author.id].money = money[message.author.id].money - tekilaFiyat;
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
        }

        else if (args[1] === "şarap") {
            message.reply("kırmızı şarap mı istersiniz yoksa beyaz mı?");
        }

        else if (args[1] === "kırmızışarap") {
            if (money[message.author.id].money < kirmiziFiyat  && mafya.includes(message.author.id) === false) {
                message.reply("yeterli paranız bulunmamakta.")
                return;
            }
            message.reply("buyrun, kırmızı şarabınız.", { files: ["https://i.hizliresim.com/7By2Br.jpg"] });

            if(mafya.includes(message.author.id) === true) return;

            money[message.author.id].money = money[message.author.id].money - kirmiziFiyat;
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
        }
        else if (args[1] === "beyazşarap") {
            if (money[message.author.id].money < beyazFiyat && mafya.includes(message.author.id) === false) {
                message.reply("yeterli paranız bulunmamakta.")
                return;
            }

            if(mafya.includes(message.author.id) === true) return;

            message.reply("buyrun efendim.", { files: ["https://i.hizliresim.com/vaJYNO.jpg"] });
            money[message.author.id].money = money[message.author.id].money - beyazFiyat;
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
        }
        else if (args[1] === "şampanya") {
            if (money[message.author.id].money < sampanyaFiyat && mafya.includes(message.author.id) === false) {
                message.reply("yeterli paranız bulunmamakta.")
                return;
            }
            message.reply("şampanyanız hazır efendim.", { files: ["https://i.hizliresim.com/p5GvML.jpg"] });

            if(mafya.includes(message.author.id) === true) return;

            money[message.author.id].money = money[message.author.id].money - sampanyaFiyat;
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
        }
        else {
            message.reply("dilediğiniz içki ne yazık ki bizde bulunmamakta. !menü ile elimizde bulunan içkileri öğrenebilirsiniz.");
        }
    }

    // Bardaki içki menüsünü gösterir.
    if (args[0] === "menü") {
        const embed = new Discord.RichEmbed()
            .setTitle('İçki Menüsü')
            .addField('Bira', biraFiyat + "$ (bira)")
            .addField('Vodka', vodkaFiyat + "$ (vodka)")
            .addField('Tekila', tekilaFiyat + "$ (tekila)")
            .addField('Kırmızı Şarap', kirmiziFiyat + "$ (kırmızışarap)")
            .addField('Beyaz Şarap', beyazFiyat + "$ (beyazşarap)")
            .addField('Şampanya', sampanyaFiyat + "$ (şampanya)")
            .addField('Sipariş', 'Sipariş vermek için !bar yazıp boşluk bırakarak parantez içindeki içki adlarından birini yazın. Örnek: !bar bira')
            .setColor(0x3089e3)
        message.channel.sendEmbed(embed).catch(err => console.log(err));
        return;
    }

    // Bot komutlarını gösterir
    if (args[0] === "yardım") {
        const embed = new Discord.RichEmbed()
            .setTitle('Gazino Yardım')
            .addField('!yardım', "Gazino komutlarını gösterir.")
            .addField("!hesapaç", "Eğer gazinomuzda yeniyseniz bu komut ile hesap açabilirsiniz.")
            .addField("!bakiye", "Varolan bir hesabınız varsa hesabınızda kaç para olduğunu öğrenirsiniz.")
            .addField("!paraver <sayı> @kişi", "Mentionladığınız kişinin hesabına belirttiğiniz miktarda para aktarabilirsiniz.")
            .addField("!claim", "Bakiyenizde hiç para kalmadıysa 100$ borç alabilirsiniz.")
            .addField("!menü", "Bar menümüzü gösterir.")
            .addField("!bar <içki adı>", "Bakiyeniz yettiği sürece bardan istediğiniz içkiyi alabilirsiniz. (Örnek: !bar kırmızışarap)")
            .addField("!yazıtura <bahis> <yüz>", "Yazı tura oynamak için bu komutu kullanabilirsiniz. Kazanırsanız bahsinizin 2 katı size geri döner. Yüz olarak yazı veya tura yazabilirsiniz.")
            .addField("!zaroyunu <bahis>", "Zar oyunu oynamak için bu komutu kullanabilirsiniz. Kazanırsanız bahsinizin 2 katı size geri döner.")
            .addField("!çarkıfelek <bahis> <ihtimal>", "Çarkıfelek oynamak için bu komutu kullanabilirsiniz. Nasıl oynandığını öğrenmek için !kurallar çarkıfelek yazın.")
            .addField("!slot <bahis>", "Slot makinesini kullanmak için bu komutu kullanabilirsiniz.")
            .addField("!yarış ve !yarışbahis <bahis> <yarışçı no.>", "Araba yarışında bahis oynamak isterseniz !yarış komutu ile bir yarış başlatabilirsiniz. Ardınan !yarışbahis <bahis> <yarışçı no.> ile istediğiniz bir yarışçıya bahis oynayabilirsiniz.")
            .addField("!kurallar <oyun adı>", "Gazinomuzda oynayabileceğiniz oyunlardan herhangi birinin kurallarını öğrenmek için bu komutu kullanabilirsiniz. Örnek: !kurallar zaroyunu")
            .addField("Soru ve diğer yardımlar", "Soru, görüş, öneri ve yardım için gazinomuzun sahibi schweppestr#3352 beye ulaşabilirsiniz.")
            .setColor(0x05e335)
        message.channel.sendEmbed(embed).catch(err => console.log(err));
        return;
    }

    // Oyun kuralları
    if (args[0] === "kurallar") {
        if (args[1] === "zaroyunu") {
            message.reply("zar oyununda hem oyuncu hem de gazino 2 tane zar atar. Eğer oyuncunun zarlarının toplamı gazinun toplamını geçerse, bahsinin 2 katını kazanır. Berabere durumunda kazanç veya kayıp olmaz.")
            return;
        }
        else if (args[1] === "yazıtura") {
            message.reply("yazı turada bir bozuk para atılır ve gelen yüz, sizin seçtiğiniz yüz ile aynı ise bahsinizin 2 katını kazanırsınız.")
            return;
        }
        else if (args[1] === "çarkıfelek") {
            message.reply("çarkıfelek oynarken paranızı 5 ihtimalden birine yatırabilirsiniz. Örneğin 1 ihtimaline 10$ yatırabilirsiniz. İhtimaller 1, 2, 5, 10 ve 20'dir. Ardından çark çevrilir ve eğer ok sizin seçtiğiniz sayının üstüne gelirse bahsinizin oka gelen sayı kadar katını kazanırsınız. Örnek: 1 sayısına 10$ yatırıp kazanmak size 10$ kazandırır. Ok çok düşük ihtimalle 40 sayısının üstüne gelebilir, bu durumda otomatik olarak kazanırsınız.")
        }
        else if (args[1] === "slot") {
            const embed = new Discord.RichEmbed()
                .setTitle('Slot makinesi bahis oranları')
                .addField('1 x <:Kalpgul:603890144457785345>', '2x')
                .addField('2 x <:Kalpgul:603890144457785345>', '5x')
                .addField('3 x <:Kalpgul:603890144457785345>', '500x')
                .addField('3 x :police_car:', '25x')
                .addField('3 x :clown:', '50x')
                .addField('3 x :spades:', '75x')
                .addField('3 x :six: :nine:', '100x')
                .addField('3 x 💙', '250x')
                .setColor(0x97a7e6)
            message.channel.sendEmbed(embed).catch(err => console.log(err));;
            return;
        }
        else if (args[1] === "yarış") {
            message.reply("!yarış yazarak yarışı başlatabilirsiniz. Mevcut 6 yarışçının isimleri, arabaları ve bahis oranları size gösterilir. Hangi yarışçıya bahis oynamak istediğinize karar verdiğinizde !yarışbahis <bahis> <yarışçı no.> ile bahis oynayabilirsiniz. Örnek: !yarışbahis 100 1")
            return;
        }
    }

    // Yazı tura
    if (args[0] === "yazıtura") {
        if (!money[message.author.id]) {
            message.reply("lütfen müessesemizin imkanlarından faydalanmak için !hesapaç komutu ile hesap açın.");
            return;
        }

        if (isNumeric(args[1]) === true) {
            if (args[2] !== "yazı" && args[2] !== "tura") return;

            var playerBet = parseInt(args[1]);

            if (playerBet > money[message.author.id].money) {
                message.reply("yeterli paranız bulunmamakta.")
                return;
            }
            else if (playerBet < 1) {
                message.reply("lütfen geçerli bir miktar girin.")
                return;
            }

            money[message.author.id].money = money[message.author.id].money - playerBet
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });

            var coin = Math.floor(randomNumber() * 2) + 1;
            if (coin === 1) {
                var coin = "yazı";
            }
            else {
                var coin = "tura";
            }

            message.reply("para " + coin + " geldi.")
            if (coin === args[2]) {
                message.reply("tebrikler, " + playerBet * 2 + "$ kazandınız!")
                money[message.author.id].money = money[message.author.id].money + (playerBet * 2)
                fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                    if (err) console.log(err);
                });
                return;
            }
            else {
                message.reply("ne yazık ki kaybettiniz.")
                return;
            }

        }
    }

    // Zar atmaca
    // Oyuncu ve gazino için 2 zar atılır
    // Oyuncu zarları toplamı gazino zarları toplamını geçerse bahsinin 2 katını kazanır
    // Berabere durumunda bir kayıp veya kazanç olmaz
    if (args[0] === "zaroyunu") {
        if (!money[message.author.id]) {
            message.reply("lütfen müessesemizin imkanlarından faydalanmak için !hesapaç komutu ile hesap açın.");
            return;
        }

        if (isNumeric(args[1]) === false) {
            message.reply("lütfen geçerli bir sayı girin.")
            return;
        }

        var playerBet = parseInt(args[1]);

        if (playerBet > money[message.author.id].money) {
            message.reply("yeterli paranız bulunmamakta.")
            return;
        }
        else if (playerBet < 1) {
            message.reply("lütfen geçerli bir miktar girin.")
            return;
        }


        money[message.author.id].commandDate = new Date();

        money[message.author.id].money = money[message.author.id].money - playerBet
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });


        var playerDice1 = Math.floor((randomNumber() * 6) + 1)
        var playerDice2 = Math.floor((randomNumber() * 6) + 1)
        var playerTotal = playerDice1 + playerDice2

        var dealerDice1 = Math.floor((randomNumber() * 6) + 1)
        var dealerDice2 = Math.floor((randomNumber() * 6) + 1)
        var dealerTotal = dealerDice1 + dealerDice2

        message.reply("attığınız zarlar: " + playerDice1 + ", " + playerDice2 + " (Toplam: " + playerTotal + ").\nGazino zarları: " + dealerDice1 + ", " + dealerDice2 + " (Toplam: " + dealerTotal + ").")

        if (playerTotal < dealerTotal) {
            message.reply("ne yazık ki kaybettiniz.")
            return;
        }
        else if (playerTotal === dealerTotal) {
            message.reply("Sonuç berabere. Paranızı geri alabilirsiniz.")
            money[message.author.id].money = money[message.author.id].money + playerBet
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
            return;
        }
        else {
            message.reply("tebrikler, " + playerBet * 2 + "$ kazandınız!")
            money[message.author.id].money = money[message.author.id].money + (2 * playerBet)
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
            return;
        }
    }


    // Çarkıfelek
    // Kuralları gta wikiden kopyalıyorum üşendim 
    /*	As in roulette, you put money on spots on a board. However, here you can only pick six spots- $1, $2, $5, $10, $20, and the star. 
    The payout for each space is shown by the dollar amount (the star is $40) - for example, betting $1 on the $20 spot will give $20 if the player wins. 
    Once done betting, the wheel will be spun. If the wheel lands on the space bet on, the player will win. If not, the player loses.*/
    if (args[0] === "çarkıfelek") {
        if (!money[message.author.id]) {
            message.reply("lütfen müessesemizin imkanlarından faydalanmak için !hesapaç komutu ile hesap açın.");
            return;
        }

        if (isNumeric(args[1]) === false) return;
        if (isNumeric(args[2]) === false) return;
        if (parseInt(args[2]) !== 1 && parseInt(args[2]) !== 2 && parseInt(args[2]) !== 5 && parseInt(args[2]) !== 10 && parseInt(args[2]) !== 20) return;

        var playerBet = parseInt(args[1]);
        if (playerBet > money[message.author.id].money) {
            message.reply("yeterli paranız bulunmamakta.")
            return;
        }
        else if (playerBet < 1) {
            message.reply("lütfen geçerli bir miktar girin.")
            return;
        }


        money[message.author.id].commandDate = new Date();

        money[message.author.id].money = money[message.author.id].money - playerBet;

        var wheel = Math.floor(randomNumber() * 100) + 1;

        if (wheel < 41) {
            wheel = 1
        }
        else if (wheel > 40 && wheel < 66) {
            wheel = 2
        }
        else if (wheel > 65 && wheel < 81) {
            wheel = 5
        }
        else if (wheel > 80 && wheel < 91) {
            wheel = 10
        }
        else if (wheel > 90 && wheel < 98) {
            wheel = 20
        }
        else {
            wheel = 40
        }

        message.reply("çark çevrildi ve ok " + wheel + " sayısının üstüne geldi.")

        if (wheel === 40) {
            message.reply("tebrikler, " + (playerBet * (wheel + 1)) + "$ kazandınız!")
            money[message.author.id].money += (playerBet * (wheel + 1))
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
            return;
        }

        if (parseInt(args[2]) === wheel) {
            message.reply("tebrikler, " + (playerBet * (wheel + 1)) + "$ kazandınız.")
            money[message.author.id].money += (playerBet * (wheel + 1))

        }
        else {
            message.reply("ne yazık ki kaybettiniz.")
        }
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        return;

    }

    // Slot makinesi
    if (args[0] === "slot") {
        if (!money[message.author.id]) {
            message.reply("lütfen müessesemizin imkanlarından faydalanmak için !hesapaç komutu ile hesap açın.");
            return;
        }
        if (!args[1]) return;
        if (isNumeric(args[1]) === false) return;

        var playerBet = parseInt(args[1]);
        if (playerBet > parseInt(money[message.author.id].money)) {
            message.reply("yeterli paranız bulunmamakta.")
            return;
        }
        else if (playerBet < 10) {
            message.reply("lütfen geçerli bir miktar girin. En az 10$ yatırabilirsiniz.")
            return;
        }

        money[message.author.id].money -= playerBet;

        var symbolsBase = ["<:Kalpgul:603890144457785345>", "💙", ":spades:", ":six: :nine:", ":clown:", ":police_car:"]
        var symbols = ["<:Kalpgul:603890144457785345>", "💙", "💙", ":spades:", ":spades:", ":spades:", ":six: :nine:", ":six: :nine:", ":six: :nine:", ":clown:", ":clown:", ":clown:", ":clown:", ":police_car:", ":police_car:", ":police_car:", ":police_car:", ":police_car:"]
        var slotResults = []

        var counter;
        var aysegulCounter = 0;
        var rngResult;

        for (counter = 0; counter < 3; counter++) {
            rngResult = Math.floor(randomNumber() * symbols.length);
            slotResults.push(symbols[rngResult])

            if (rngResult === 0) {
                aysegulCounter += 1;
            }

        }

        message.reply("[ " + slotResults[0] + " | " + slotResults[1] + " | " + slotResults[2] + " ]")

        if (aysegulCounter > 0) {
            if (aysegulCounter === 3) {
                message.reply("tebrikler, " + playerBet * 500 + "$ kazandınız!")
                money[message.author.id].money += playerBet * 500
            }
            else if (aysegulCounter === 2) {
                message.reply("tebrikler, " + playerBet * 5 + "$ kazandınız!")
                money[message.author.id].money += playerBet * 5
            }
            else if (aysegulCounter === 1) {
                message.reply("tebrikler, " + playerBet * 2 + "$ kazandınız!")
                money[message.author.id].money += playerBet * 2
            }

            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
            return;
        }

        if (slotResults[0] === slotResults[1] && slotResults[0] === slotResults[2]) {
            if (slotResults[0] === "💙") {
                message.reply("tebrikler, " + playerBet * 250 + "$ kazandınız!")
                money[message.author.id].money += playerBet * 250
            }
            else if (slotResults[0] === ":six: :nine:") {
                message.reply("tebrikler, " + playerBet * 100 + "$ kazandınız!")
                money[message.author.id].money += playerBet * 100
            }
            else if (slotResults[0] === ":spades:") {
                message.reply("tebrikler, " + playerBet * 75 + "$ kazandınız!")
                money[message.author.id].money += playerBet * 75
            }
            else if (slotResults[0] === ":clown:") {
                message.reply("tebrikler, " + playerBet * 50 + "$ kazandınız!")
                money[message.author.id].money += playerBet * 50
            }
            else if (slotResults[0] === ":police_car:") {
                message.reply("tebrikler, " + playerBet * 25 + "$ kazandınız!")
                money[message.author.id].money += playerBet * 25
            }
        }

        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        return;

    }


    // Araba yarışı
    if (args[0] === "yarış") {
        if (!money[message.author.id]) {
            message.reply("lütfen müessesemizin imkanlarından faydalanmak için !hesapaç komutu ile hesap açın.");
            return;
        }

        if (money[message.author.id].playingRace === true) {
            message.reply('lütfen önce başlattığınız yarışa "!yarışbahis <bahis> <yarışçı numarası>" komutu ile bahis oynayın.')
            return;
        }

        money[message.author.id].playingRace = true;

        var racers = racerArray;

        var n
        for (n = 0; n < racers.length; n++) {
            racers[n].betTotal = racers[n].betMin + Math.floor(randomNumber() * (racers[n].betMax - racers[n].betMin))
            money[message.author.id].raceBetList[n] = racers[n].betTotal
        }

        // Bahisleri gösteren ember burada oluşturuluyor. 
        // Yarışçıların isimleri, araçları ve bahis oranları gösteriliyor.
        // Her oyuncu için oranlar rastgele oluşturuluyor.
        const embed = new Discord.RichEmbed()
            .setTitle(message.author.username + " için yarışçı listesi")

        var i
        for (i = 0; i < racers.length; i++) {
            embed.addField(i + 1 + "- " + racers[i].name, "Araç: " + racers[i].car + " | Bahis oranı: 1/" + racers[i].betTotal)
        }

        embed.addField("Nasıl bahis yatırılır?", 'İstediğiniz yarışçıya bahis yatırmak için "!yarışbahis <bahis> <yarışçı numarası>" komutunu kullanabilirsiniz. Örnek: !yarışbahis 500 1')
        embed.setColor(0xfc6b03)
        message.channel.sendEmbed(embed).catch(err => console.log(err));;

        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        return;
    }


    if (args[0] === "yarışbahis") {
        if (!money[message.author.id]) {
            message.reply("lütfen müessesemizin imkanlarından faydalanmak için !hesapaç komutu ile hesap açın.");
            return;
        }

        if (money[message.author.id].playingRace === false) {
            message.reply('lütfen önce !yarış komutu ile yarış başlatın.')
            return;
        }

        if (isNumeric(args[1]) === false) return;
        if (isNumeric(args[2]) === false) return;

        var playerBet = parseInt(args[1]);

        if (playerBet > parseInt(money[message.author.id].money)) {
            message.reply("yeterli paranız bulunmamakta.")
            return;
        }
        else if (playerBet < 1) {
            message.reply("lütfen geçerli bir miktar girin.")
            return;
        }


        var racerNumber = parseInt(args[2]) - 1;
        if (racerNumber + 1 < 1 || racerNumber + 1 > 6) {
            message.reply("lütfen geçerli bir yarışçı numarası girin.")
            return;
        }

        money[message.author.id].money -= playerBet

        // 1+25+25+20+15+14
        var raceWinnerPercent = Math.floor(randomNumber() * 100) + 1;
        var raceWinner;
        if (raceWinnerPercent < 26) {
            raceWinner = 0; // PAUL WALKER
            message.reply("Kazanan: Paul Walker")
        }
        else if (raceWinnerPercent > 25 && raceWinnerPercent < 51) {
            raceWinner = 1; // VIN DIESEL
            message.reply("Kazanan: Vin Diesel")
        }
        else if (raceWinnerPercent > 50 && raceWinnerPercent < 71) {
            raceWinner = 2; // RYAAAAAAAAAAAAAAAAAAAN COOOPPEEEEEEEEEEEEER
            message.reply("Kazanan: Ryan Cooper")
        }
        else if (raceWinnerPercent > 70 && raceWinnerPercent < 86) {
            raceWinner = 4; // SEDA BROLI
            message.reply("Kazanan: Br0Li SeDa")
        }
        else if (raceWinnerPercent > 85 && raceWinnerPercent < 99) {
            raceWinner = 3; // RAZOR
            message.reply("Kazanan: Rockportlu Razor")
        }
        else {
            raceWinner = 5; // İSMAİL
            message.reply("Kazanan: İsmail Yazar")
        }

        if (racerNumber === raceWinner) {
            message.reply("Tebrikler! " + playerBet * money[message.author.id].raceBetList[raceWinner] + "$ kazandınız!")
            money[message.author.id].money += playerBet * money[message.author.id].raceBetList[raceWinner]
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
            return;
        }
        else {
            message.reply("ne yazık ki kaybettiniz.")
        }

        money[message.author.id].raceBetList = [0, 0, 0, 0, 0, 0];
        money[message.author.id].playingRace = false;
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        return;

    }

})


bot.login(process.env.BOT_TOKEN);
