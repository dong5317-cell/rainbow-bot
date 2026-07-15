const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});


const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;
const ROLE_ID = process.env.GUILD_ID; 

/const colors = [
    0xff0000, // Red
    0xff7f00, // Orange
    0xffff00, // Yellow
    0x00ff00, // Green
    0x0000ff, // Blue
    0x4b0082, // Indigo
    0x9400d3  // Violet
];

// ★ 대기 시간을 15초(15000ms) 단일 주기로 안전하게 고정합니다.
// 디스코드 API 차단을 피하기 위한 가장 적절한 타협점입니다.
const SAFE_DELAY = 15000; 

let colorIndex = 0;
let running = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 원래 코드의 clientReady를 올바른 이벤트 이름인 Events.ClientReady로 수정했습니다.
client.once(Events.ClientReady, async () => {

    console.log(`[시작] ${client.user.tag} 봇이 온라인 상태가 되었습니다.`);

    // 캐시 대신 입력한 GUILD_ID로 서버를 안전하게 가져옵니다.
    const guild = client.guilds.cache.get(GUILD_ID);

    if (!guild) {
        console.log("[오류] 입력하신 GUILD_ID에 해당하는 서버를 찾을 수 없습니다.");
        return;
    }

    console.log("연결된 서버:", guild.name);

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
            console.log("시도하는 색상 번호:", colorIndex);
            console.log("현재 대기 시간:", SAFE_DELAY / 1000, "초");

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

                console.log("SUCCESS (성공)");
                colorIndex = (colorIndex + 1) % colors.length;
                await sleep(SAFE_DELAY);

            } else if (response.status === 429) {

                const data = await response.json();

                console.log("RATE LIMITED (요청 제한 초과)");
                console.log("디스코드 대기 지시 시간:", data.retry_after, "초");

                colorIndex = (colorIndex + 1) % colors.length;

                // 디스코드가 기다리라고 한 시간만큼 안전하게 정지합니다.
                await sleep(Math.ceil(data.retry_after * 1000) + 1000);

            } else {

                console.log("HTTP 에러 상태코드:", response.status);
                const text = await response.text();
                console.log("상세 에러 내용:", text);

                colorIndex = (colorIndex + 1) % colors.length;
                await sleep(SAFE_DELAY);

            }

        } catch (error) {

            clearTimeout(timeout);

            if (error.name === "AbortError") {
                console.log("요청 시간 초과 (REQUEST TIMEOUT)");
            } else {
                console.log("ERROR:", error.message);
            }

            colorIndex = (colorIndex + 1) % colors.length;
            await sleep(SAFE_DELAY);

        }

        running = false;

    }

});

client.login(TOKEN);