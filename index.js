const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

const colors = [
    0xff0000,
    0xff7f00,
    0xffff00,
    0x00ff00,
    0x00ffff,
    0x0000ff,
    0x8b00ff,
    0xff00ff
];

client.once("ready", () => {
    console.log(`${client.user.tag} 실행됨`);

    let i = 0;

    setInterval(() => {
        const guild = client.guilds.cache.first();
        if (!guild) return;

        const role = guild.roles.cache.get(ROLE_ID);
        if (!role) return;

        role.setColor(colors[i]);

        i++;

        if (i >= colors.length) {
            i = 0;
        }

    }, 1000);
});

client.login(TOKEN);