client.once("clientReady", () => {
    console.log(`${client.user.tag} is online`);

    let i = 0;

    async function changeColor() {
        try {
            const guild = client.guilds.cache.first();

            if (!guild) {
                console.log("Guild not found");
                return;
            }

            const role = guild.roles.cache.get(ROLE_ID);

            if (!role) {
                console.log("Role not found");
                return;
            }

            console.log("Trying color:", i);

            await Promise.race([
                role.setColor(colors[i]),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("timeout")), 2000)
                )
            ]);

            console.log("Color changed:", i);

        } catch (error) {
            console.error("Color failed:", i, error.message);
        }

        i = (i + 1) % colors.length;

        setTimeout(changeColor, 3000);
    }

    changeColor();
});

client.login(TOKEN);