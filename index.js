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
    let changing = false;

    async function changeColor() {

        if (changing) {
            console.log("Previous change still running");
            return;
        }

        changing = true;

        try {
            const guild = client.guilds.cache.first();

            const role = guild.roles.cache.get(ROLE_ID);

            if (!role) {
                console.log("Role not found");
                changing = false;
                return;
            }

            console.log("Trying color:", index);

            role.setColor(colors[index])
                .then(() => {
                    console.log("Color changed:", index);
                })
                .catch(err => {
                    console.log("Color failed:", err.message);
                });

            index = (index + 1) % colors.length;

        } catch (err) {
            console.log("Error:", err.message);
        }

        changing = false;

        setTimeout(changeColor, 10000);
    }

    changeColor();
});

client.login(TOKEN);