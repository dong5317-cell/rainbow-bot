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
    0x9955ff,
    0xff55cc
];

client.once("clientReady", () => {

    console.log(`${client.user.tag} is online`);

    let index = 0;

    async function changeColor() {

        try {

            const guild = client.guilds.cache.first();

            const role = await guild.roles.fetch(ROLE_ID);

            if (!role) {
                console.log("Role not found");
                return;
            }

            console.log("Trying color:", index);

            await role.setColor(colors[index]);

            console.log("Color changed:", index);

            index = (index + 1) % colors.length;


        } catch (error) {

            console.log(
                "Color failed:",
                index,
                error.message
            );

            index = (index + 1) % colors.length;

        }


        // Discord API 안정 시간
        setTimeout(changeColor, 60000);

    }


    changeColor();

});


client.login(TOKEN);client.login(TOKEN);