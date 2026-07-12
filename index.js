const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

const colors = [
    0xff0000, // Red
    0xff7f00, // Orange
    0xffff00, // Yellow
    0x00ff00, // Green
    0x0000ff, // Blue
    0x4b0082, // Indigo
    0x9400d3  // Violet
];

client.once("clientReady", () => {

    console.log(`${client.user.tag} is online`);

    const guild = client.guilds.cache.first();

    if (!guild) {
        console.log("Guild not found");
        return;
    }

    console.log("Guild:", guild.name);

    let index = 0;

    async function changeColor() {

        const color = colors[index];

        console.log("--------------------------------");
        console.log("Trying color:", index);

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 10000);

        try {

            const response = await fetch(
                `https://discord.com/api/v10/guilds/${guild.id}/roles/${ROLE_ID}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bot ${TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        color: color
                    }),
                    signal: controller.signal
                }
            );

            clearTimeout(timeout);

            console.log("HTTP:", response.status);

            if (response.status === 200) {

                console.log("SUCCESS");

            } else if (response.status === 429) {

                const data = await response.json();

                console.log("RATE LIMITED");

                if (data.retry_after) {

                    console.log(
                        "Retry after:",
                        data.retry_after,
                        "seconds"
                    );

                }

            } else {

                const text = await response.text();

                console.log("FAILED:", text);

            }

        } catch (err) {

            clearTimeout(timeout);

            if (err.name === "AbortError") {

                console.log("TIMEOUT");

            } else {

                console.log("ERROR:", err.message);

            }

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