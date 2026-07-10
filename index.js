const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

const colors = [
    0xff0000, // 빨강
    0xff7f00, // 주황
    0xffff00, // 노랑
    0x00ff00, // 초록
    0x00ffff, // 하늘
    0x0000ff, // 파랑
    0x8b00ff  // 보라
];

client.once("ready", () => {
    console.log(`${client.user.tag} 실행됨`);

    let i = 0;

    setInterval(async () => {
        const guild = client.guilds.cache.first();
        const role = guild.roles.cache.get(ROLE_ID);

        await role.setColor(colors[i]);

        i++;

        if (i >= colors.length) {
            i = 0;
        }

    }, 3000);
});

client.login(TOKEN);