const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

const colors = [
    "#ff0000",
    "#ff7f00",
    "#ffff00",
    "#00ff00",
    "#0000ff",
    "#4b0082",
    "#9400d3"
];

client.once("clientReady", () => {
    console.log(`${client.user.tag} is online`);

    let i = 0;

    async function changeColor() {
        try {
            const guild = client.guilds.cache.first();
            if (!guild) return;

            const role = guild.roles.cache.get(ROLE_ID);
            if (!role) return;

            console.log("Trying color:", i);

            await Promise.race([
                role.setColor(colors[i]),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Color change timeout")), 3000)
                )
            ]);

            console.log("Color changed:", i);

            i = (i + 1) % colors.length;

        } catch (err) {
            console.error("COLOR ERROR:", err.message);
        }

        setTimeout(changeColor, 3000);
    }

    changeColor();
});

client.login(TOKEN);