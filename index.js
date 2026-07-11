const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

const colors = [
    0xff0000,
    0x00ff00,
    0x0000ff
];

client.once("clientReady", () => {
    console.log(`${client.user.tag} is online`);

    let index = 0;

    async function changeColor() {
        const currentColor = index;

        try {
            const guild = client.guilds.cache.first();

            if (!guild) {
                console.log("Guild not found");
                setTimeout(changeColor, 5000);
                return;
            }

            const role = guild.roles.cache.get(ROLE_ID);

            if (!role) {
                console.log("Role not found");
                setTimeout(changeColor, 5000);
                return;
            }

            console.log("Trying color:", currentColor);

            await role.setColor(colors[currentColor]);

            console.log("Color changed:", currentColor);

        } catch (error) {
            console.log("Color failed:", currentColor, error.message);
        }

        index = (currentColor + 1) % colors.length;

       setTimeout(changeColor, 10000);
    }

    changeColor();
});

client.login(TOKEN);