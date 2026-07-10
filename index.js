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
    0x0000ff,
    0x4b0082,
    0x9400d3
];

client.once("ready", () => {
    console.log(`${client.user.tag} 실행됨`);

    let i = 0;

    setInterval(async () => {
        const guild = client.guilds.cache.first();

        if (!guild) return;

        const role = guild.roles.cache.get(ROLE_ID);

        if (!role) return;

        await role.setColor(colors[i]);

        console.log("색 변경:", colors[i]);

        i = (i + 1) % colors.length;

    }, 1000);
});

client.login(TOKEN);