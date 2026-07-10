const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

// 무지개 색상 (42단계)
const colors = [
    0xff0000,
    0xff2200,
    0xff4400,
    0xff6600,
    0xff8800,
    0xffaa00,
    0xffcc00,
    0xffee00,
    0xffff00,

    0xddff00,
    0xbbff00,
    0x99ff00,
    0x77ff00,
    0x55ff00,
    0x33ff00,
    0x00ff00,

    0x00ff33,
    0x00ff66,
    0x00ff99,
    0x00ffcc,
    0x00ffff,

    0x00ddff,
    0x00bbff,
    0x0099ff,
    0x0077ff,
    0x0055ff,
    0x0033ff,
    0x0000ff,

    0x2200ff,
    0x4400ff,
    0x6600ff,
    0x8800ff,
    0xaa00ff,
    0xcc00ff,
    0xee00ff,
    0xff00ff,

    0xff00cc,
    0xff0099,
    0xff0066,
    0xff0033,
    0xff0011,
    0xff0000
];

client.once("clientReady", () => {
    console.log(`${client.user.tag} 실행됨!`);

    let i = 0;

setInterval(async () => {
    try {
        const guild = client.guilds.cache.first();
        if (!guild) return;

        // 매번 최신 역할 정보 가져오기
        const role = await guild.roles.fetch(ROLE_ID);
        if (!role) return;

        console.log(`색 변경: ${i}`);

        await role.setColor(colors[i]);

        i = (i + 1) % colors.length;

    } catch (err) {
        console.error("오류:", err);
    }
}, 1000); // 1초마다 변경
});

client.login(TOKEN);