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

client.once("clientReady", () => {
    console.log(`${client.user.tag} is online`);

    let index = 0;

    async function changeColor() {
        const current = index;

        try {
            const guild = client.guilds.cache.first();

            if (!guild) {
                console.log("Guild not found");
                return;
            }

            const role = guild.roles.cache.get(ROLE_ID);

            if (!role) {
                console.log("Role not found");
                return;
            }

            console.log("Trying color:", current);

            await Promise.race([
                role.setColor(colors[current]),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("timeout")), 8000)
                )
            ]);

            console.log("Color changed:", current);

        } catch (error) {
            console.log("Color skipped:", current, error.message);
        }

        index = (current + 1) % colors.length;

        setTimeout(changeColor, 10000);
    }

    changeColor();
});

client.login(TOKEN);