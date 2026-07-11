const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
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

client.once("clientReady", async () => {

    console.log(`${client.user.tag} is online`);

    let index = 0;

    async function changeColor() {

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


            console.log("Guild:", guild.name);
            console.log("Role:", role.name);
            console.log("Role position:", role.position);
            console.log(
                "Bot role position:",
                guild.members.me.roles.highest.position
            );


            console.log("Trying color:", index);


            await role.edit({
                color: colors[index],
                reason: "Rainbow role color update"
            });


            console.log("Color changed:", index);


            index = (index + 1) % colors.length;


        } catch (error) {

            console.log(
                "Color failed:",
                error.message
            );

            index = (index + 1) % colors.length;

        }


        setTimeout(changeColor, 30000);

    }


    changeColor();

});


client.login(TOKEN);