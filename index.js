const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

// HSL → HEX 변환 함수
function hslToHex(h, s, l) {
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

    return (r << 16) + (g << 8) + b;
}

client.once("ready", () => {
    console.log(`${client.user.tag} 실행됨`);

    let hue = 0;

    setInterval(async () => {
        try {
            const guild = client.guilds.cache.first();
            if (!guild) return;

            const role = guild.roles.cache.get(ROLE_ID);
            if (!role) return;

            // Hue를 조금씩 증가 (0~359)
            hue = (hue + 1) % 360;

            // HSL → HEX
            const color = hslToHex(hue, 100, 50);

            await role.setColor(color);

        } catch (err) {
            console.error("색상 변경 실패:", err);
        }
    }, 500);
});

client.login(TOKEN);