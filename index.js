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
    console.log(`${client.user.tag} is online`);

    let i = 0;

    setInterval(async () => {
        try {
            const guild = client.guilds.cache.first();

            if (!guild) {
                console.log("No guild");
                return;
            }

            const role = guild.roles.cache.get(ROLE_ID);

            if (!role) {
                console.log("Role not found");
                return;
            }

            console.log("Trying color:", i);

            await role.setColor(colors[i]);

            console.log("Color changed:", i);

            i = (i + 1) % colors.length;

        } catch (err) {
            console.error("COLOR ERROR:", err);
        }

    }, 1000);
});

client.login(TOKEN);