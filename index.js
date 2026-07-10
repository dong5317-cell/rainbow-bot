const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

let hue = 0;

// HSL → RGB
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h < 60) {
        r = c; g = x; b = 0;
    } else if (h < 120) {
        r = x; g = c; b = 0;
    } else if (h < 180) {
        r = 0; g = c; b = x;
    } else if (h < 240) {
        r = 0; g = x; b = c;
    } else if (h < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return (r << 16) | (g << 8) | b;
}

client.once("clientReady", () => {
    console.log(`${client.user.tag} 실행됨!`);

    const guild = client.guilds.cache.first();
    if (!guild) return;

    const role = guild.roles.cache.get(ROLE_ID);
    if (!role) return;

    setInterval(async () => {
        try {
            const color = hslToRgb(hue, 100, 50);

            if (role.color !== color) {
                await role.setColor(color);
            }

            hue = (hue + 3) % 360;

        } catch (err) {
            console.error(err);
        }
    }, 500);
});

client.login(TOKEN);