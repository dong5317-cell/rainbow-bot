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

// Delay levels (milliseconds)
const delays = [
    3000,
    5000,
    8000,
    10000,
    15000,
    20000,
    30000
];

let delayIndex = 0;
let successCount = 0;
let colorIndex = 0;
let running = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.once("clientReady", async () => {

    console.log(`${client.user.tag} is online`);

    const guild = client.guilds.cache.first();

    if (!guild) {
        console.log("Guild not found");
        return;
    }

    console.log("Guild:", guild.name);

    while (true) {

        if (running) {
            await sleep(1000);
            continue;
        }

        running = true;

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 10000);

        try {

            console.log("--------------------------------");
            console.log("Trying color:", colorIndex);
            console.log("Current delay:", delays[delayIndex] / 1000, "seconds");

            const response = await fetch(
                `https://discord.com/api/v10/guilds/${guild.id}/roles/${ROLE_ID}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bot ${TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        color: colors[colorIndex]
                    }),
                    signal: controller.signal
                }
            );

            clearTimeout(timeout);

            if (response.status === 200) {

                console.log("SUCCESS");

                successCount++;

                colorIndex = (colorIndex + 1) % colors.length;

                if (successCount >= 10 && delayIndex > 0)

                    delayIndex--;

                    successCount = 0;

                    console.log(
                        "Delay decreased to",
                        delays[delayIndex] / 1000,
                        "seconds"
                    );
                }

                await sleep(delays[delayIndex]);

            } else if (response.status === 429) {

                const data = await response.json();

                console.log("RATE LIMITED");
                console.log("Retry after:", data.retry_after, "seconds");

                successCount = 0;

                if (delayIndex < delays.length - 1) {

                    delayIndex++;

                    console.log(
                        "Delay increased to",
                        delays[delayIndex] / 1000,
                        "seconds"
                    );
                }

                // Move to the next color even when rate limited
                colorIndex = (colorIndex + 1) % colors.length;

                // Wait exactly as long as Discord tells us
                await sleep(Math.ceil(data.retry_after * 1000) + 1000);

            } else {

                console.log("HTTP Status:", response.status);

                const text = await response.text();

                console.log(text);

                successCount = 0;

                colorIndex = (colorIndex + 1) % colors.length;

                await sleep(delays[delayIndex]);

            }

        } catch (error) {

            clearTimeout(timeout);

            if (error.name === "AbortError") {

                console.log("REQUEST TIMEOUT");

            } else {

                console.log("ERROR:", error.message);

            }

            successCount = 0;

            colorIndex = (colorIndex + 1) % colors.length;

            await sleep(delays[delayIndex]);

        }

        running = false;

    }

});

client.login(TOKEN);