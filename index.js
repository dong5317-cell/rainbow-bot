const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

// 더 부드러운 무지개 색상 목록
const colors = [
    0xff0000, // 빨강
    0xff4500, // 주황빨강
    0xff7f00, // 주황
    0xffff00, // 노랑
    0xadff2f, // 연두
    0x00ff00, // 초록
    0x00fa9a, // 민트
    0x00ffff, // 하늘
    0x008cff, // 파랑
    0x0000ff, // 진파랑
    0x4b0082, // 남색
    0x8000ff, // 보라
    0xee82ee, // 연보라
    0xff00ff  // 핑크
];

client.once("ready", async () => {
    console.log(`${client.user.tag} 실행됨`);

    let index = 0;

    setInterval(async () => {
        try {
            const guild = client.guilds.cache.first();

            if (!guild) {
                console.log("서버를 찾을 수 없음");
                return;
            }

            const role = guild.roles.cache.get(ROLE_ID);

            if (!role) {
                console.log("역할을 찾을 수 없음");
                return;
            }

            await role.edit({
                color: colors[index]
            });

            console.log(`색 변경 완료: ${index + 1}/${colors.length}`);

            index++;

            if (index >= colors.length) {
                index = 0;
            }

        } catch (error) {
            console.log("색 변경 오류:", error);
        }

    }, 2000); // 2초마다 변경
});

client.login(TOKEN);