# Front-end
KookminClaw Front-end Repository

## API

- API base URL은 `.env`의 `VITE_API_BASE_URL`로 설정합니다.
- 로컬 개발 서버에서는 CORS 우회를 위해 `.env.development`의 빈 base URL과 Vite proxy를 사용합니다.
- API 요청/응답 형태는 백엔드 Swagger 명세를 기준으로 맞춥니다.
- 공통 호출 유틸은 `src/api/client.js`를 사용합니다.
