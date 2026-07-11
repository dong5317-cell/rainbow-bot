const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;

const colors = [
    0xff5555,
    0xff9955,
    0xffff55,
    0x55ff55,
    0x55ffff,
    0x5599ff,
    0x9955ff
];

client.once("clientReady", () => {

    console.log(`${client.user.tag} is online`);

    let index = 0;

    async function changeColor() {

        const current = index;

        try {

            const guild = client.guilds.cache.first();

            if (!guild) {
                console.log("Guild not found");
                setTimeout(changeColor, 30000);
                return;
            }


            const role = await guild.roles.fetch(ROLE_ID);


            if (!role) {
                console.log("Role not found");
                setTimeout(changeColor, 30000);
                return;
            }


            console.log("Trying color:", current);


            await Promise.race([
                role.setColor(colors[current]),

                new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error("timeout"));
                    }, 15000);
                })
            ]);


            console.log("Color changed:", current);


        } catch (error) {

            console.log(
                "Color skipped:",
                current,
                error.message
            );

        }


        index = (current + 1) % colors.length;


        setTimeout(changeColor, 30000);

    }


    changeColor();

});


client.login(TOKEN);client.login(TOKEN);client.login(TOKEN);