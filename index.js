const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");

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

        try {

            const guild = client.guilds.cache.first();

            if (!guild) {
                console.log("Guild not found");
                setTimeout(changeColor, 3000);
                return;
            }

            console.log("--------------------------------");
            console.log("Guild:", guild.name);
            console.log("Trying color:", index);
            console.log("Color value:", colors[index]);

            const response = await fetch(
                `https://discord.com/api/v10/guilds/${guild.id}/roles/${ROLE_ID}`,
                {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bot ${TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        color: colors[index]
                    })
                }
            );

            console.log("HTTP Status:", response.status);

            const text = await response.text();

            console.log("Response:", text);

            if (response.status === 200) {
                console.log("SUCCESS");
            }

            if (response.status === 429) {
                console.log("RATE LIMITED");
            }

            if (response.status === 403) {
                console.log("MISSING PERMISSIONS");
            }

            if (response.status === 404) {
                console.log("ROLE NOT FOUND");
            }

        } catch (err) {

            console.log("REQUEST ERROR");
            console.log(err);

        }

        index++;

        if (index >= colors.length) {
            index = 0;
        }

        setTimeout(changeColor, 3000);

    }

    changeColor();

});

client.login(TOKEN);