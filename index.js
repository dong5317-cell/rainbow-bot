const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

// 무지개 색상 추가
const colors = [
    0xff0000, // 빨강
    0xff4500, // 주황빨강
    0xff7f00, // 주황
    0xffff00, // 노랑
    0x7fff00, // 연두
    0x00ff00, // 초록
    0x00ff7f, // 민트
    0x00ffff, // 하늘
    0x007fff, // 파랑
    0x0000ff, // 파랑
    0x4b0082, // 남색
    0x8b00ff, // 보라
    0xff00ff, // 핑크
    0xff1493  // 진핑크
];

client.once("ready", () => {
    console.log(`${client.user.tag} 실행됨`);

    let i = 0;

    setInterval(async () => {
        try {
            const guild = client.guilds.cache.first();

            if (!guild) return;

            const role = guild.roles.cache.get(ROLE_ID);

            if (!role) return;

            await role.setColor(colors[i]);

            console.log(`색 변경됨: ${colors[i].toString(16)}`);

            i++;

            if (i >= colors.length) {
                i = 0;
            }

        } catch (error) {
            console.log("색 변경 오류:", error);
        }

    }, 3000);
});

client.login(TOKEN);