const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

let hue = 0;

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);

    const f = n =>
        Math.round(
            255 *
            (l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1))
        );

    const r = f(0);
    const g = f(8);
    const b = f(4);

    return (
        "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0")
    );
}

client.once("ready", () => {
    console.log(`${client.user.tag} is online`);

    setInterval(async () => {
        try {
            const guild = client.guilds.cache.first();
            if (!guild) return;

            const role = guild.roles.cache.get(ROLE_ID);
            if (!role) return;

            const color = hslToHex(hue, 100, 50);

            await role.setColor(color);

            hue = (hue + 1) % 360;

        } catch (err) {
            console.error(err);
        }
    }, 1000);
});

client.login(TOKEN);