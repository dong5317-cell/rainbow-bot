const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

const colors = [
    "#ff0000",
    "#ff6600",
    "#ffff00",
    "#66ff00",
    "#00ff00",
    "#00ffff",
    "#0066ff",
    "#0000ff",
    "#9900ff",
    "#ff00ff"
];

client.once("clientReady", () => {
    console.log(`${client.user.tag} is online`);

    let i = 0;

    async function changeColor() {
        const current = i;

        try {
            const guild = client.guilds.cache.first();
            if (!guild) return;

            const role = guild.roles.cache.get(ROLE_ID);
            if (!role) return;

            console.log("Trying color:", current);

            await role.setColor(colors[current]);

            console.log("Color changed:", current);

        } catch (error) {
            console.log("Color skipped:", current, error.message);
        }

        i = (current + 1) % colors.length;

        setTimeout(changeColor, 5000);
    }

    changeColor();
});

client.login(TOKEN);