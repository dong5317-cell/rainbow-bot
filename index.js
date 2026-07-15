const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds] // 역할 정보를 감지하고 수정하기 위해 필요한 최소한의 인텐트
});

// 환경 변수 로드
const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const ROLE_ID = process.env.ROLE_ID;

// 무지개 색상 배열 (16진수)
const colors = [
    0xff0000, // Red
    0xff7f00, // Orange
    0xffff00, // Yellow
    0x00ff00, // Green
    0x0000ff, // Blue
    0x4b0082, // Indigo
    0x9400d3  // Violet
];

let colorIndex = 0;

// ★ 안전 주기 설정: 20초 (20000ms)
// 디스코드 역할 수정 API는 서버별 레이트 리밋이 매우 엄격하므로 20초가 가장 안정적입니다.
const SAFE_INTERVAL = 20000; 

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`=================================`);
    console.log(`봇 온라인: ${readyClient.user.tag}`);
    console.log(`=================================`);

    // 1. 대상 서버(Guild) 가져오기
    const guild = readyClient.guilds.cache.get(GUILD_ID);
    if (!guild) {
        console.error("[오류] 서버를 찾을 수 없습니다. GUILD_ID를 확인해주세요.");
        return;
    }
    console.log(`연결된 서버: ${guild.name}`);

    // 2. 대상 역할(Role) 존재 여부 및 권한 확인
    let role;
    try {
        role = await guild.roles.fetch(ROLE_ID);
        if (!role) {
            console.error("[오류] 역할을 찾을 수 없습니다. ROLE_ID를 확인해주세요.");
            return;
        }

        // 봇의 최상위 역할이 변경하려는 역할보다 아래에 있으면 수정 권한이 없습니다.
        const botMember = await guild.members.fetch(readyClient.user.id);
        if (botMember.roles.highest.position <= role.position) {
            console.warn("[경고] 봇의 역할 순위가 대상 역할보다 낮습니다. 역할 위치를 올려주세요.");
        } else {
            console.log(`대상 역할 확인 완료: '${role.name}'`);
        }
    } catch (error) {
        console.error("[오류] 역할 정보를 불러오는 중 문제가 발생했습니다:", error.message);
        return;
    }

    console.log(`무지개 역할 변경 루프를 시작합니다. (주기: ${SAFE_INTERVAL / 1000}초)`);

    // 3. 안전한 간격으로 색상 변경 반복 실행
    setInterval(async () => {
        try {
            // 주기마다 역할을 매번 새로 fetch하여 삭제 여부를 실시간으로 감지합니다.
            const currentRole = await guild.roles.fetch(ROLE_ID);
            if (!currentRole) {
                console.log("[알림] 역할을 찾을 수 없어 루프를 일시 대기합니다.");
                return;
            }

            const nextColor = colors[colorIndex];
            
            // discord.js의 내장 Rate Limit 방어 메커니즘을 이용해 안전하게 색상을 변경합니다.
            await currentRole.setColor(nextColor);
            
            console.log(`[성공] 색상 변경 완료 -> #${nextColor.toString(16).padStart(6, '0')}`);
            
            // 다음 색상 인덱스로 이동
            colorIndex = (colorIndex + 1) % colors.length;

        } catch (error) {
            // API 일시 오류, 권한 부족, 디스코드 서버 지연 등 예외 상황 처리
            console.error(`[에러 발생] ${error.message}`);
            console.log("봇이 종료되지 않고 다음 주기(20초 후)에 재시도합니다.");
        }
    }, SAFE_INTERVAL);
});

// 전역 에러 핸들러 추가 (예기치 못한 연결 끊김 등으로 봇이 꺼지는 것을 방지)
process.on("unhandledRejection", (reason, promise) => {
    console.error("처리되지 않은 거부(Unhandled Rejection):", reason);
});

client.login(TOKEN);