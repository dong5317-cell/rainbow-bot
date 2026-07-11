const { Client, GatewayIntentBits } = require("discord.js");
const convert = require("color-convert");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

let hue = 0;

client.once("ready", () => {
    console.log(`${client.user.tag} is ready`);

    setInterval(async () => {
        try {
            const guild = client.guilds.cache.first();
            if (!guild) return;

            const role = guild.roles.cache.get(ROLE_ID);
            if (!role) return;

            // HSL -> HEX
            const hex = "#" + convert.hsl.hex([hue, 100, 50]);

            await role.setColor(hex);

            hue = (hue + 2) % 360;

        } catch (err) {
            console.error(err);
        }
    }, 1000);
});

client.login(TOKEN);