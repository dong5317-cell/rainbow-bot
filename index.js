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
        try {
            const guild = client.guilds.cache.first();

            if (!guild) {
                console.log("Guild not found");
                return;
            }

            const role = await guild.roles.fetch(ROLE_ID);

            if (!role) {
                console.log("Role not found");
                return;
            }

            console.log("Trying color:", index);

            await role.edit({
                colors: {
                    primaryColor: colors[index]
                }
            });

            console.log("Color changed:", index);

            index = (index + 1) % colors.length;

        } catch (error) {
            console.log("Color failed:", error.message);
            index = (index + 1) % colors.length;
        }

        setTimeout(changeColor, 10000);
    }

    changeColor();
});

client.login(TOKEN);