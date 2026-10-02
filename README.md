# MacroDynamics (v1.0.3)

> **글로벌 금리·유동성·환율 연동 거시경제 시뮬레이터 & 시계열 퀀트 분석 플랫폼 (PWA 지원)**  
> **Designed & Developed by pandw Lee** (`pandw2k@gmail.com`)  
> **Release Version**: `v1.0.3` (2026.10)

---

## 📌 프로젝트 소개 (Overview)

**MacroDynamics**는 교과서적 경제학 이론(금리 인상 = 주가 하락, 환율 상승 = 수출 증대 등 단순 논리)과 실제 금융 시장의 복합 메커니즘 간의 괴리를 실시간 인터랙티브 시뮬레이션 및 실측 데이터로 명쾌하게 규명하는 금융공학 대시보드입니다.

- **3대 전달계 입체 동기화**: 미국 연준 기준금리, 달러 순유동성(Fed Net Liquidity / M2), 원/달러 환율의 7단계 국면(저점유지·완만상승·급등·고점유지·완만하락·급락 등) 실시간 연동
- **거시 4분면 펀더멘털 좌표계**: 실질 GDP 성장률과 CPI 인플레이션 좌표를 기반으로 골디락스, 리플레이션, 스태그플레이션, 침체/디플레이션 레짐 판별
- **2000~2026 역사적 위기 시계열 PT 모드**: 2000년 닷컴버블, 2008년 글로벌 금융위기, 2020년 코로나 팬데믹, 2024~2026년 금리 피벗 및 재인상 기조 전환 구간까지 30개월+ 실측 시계열 데이터 자동 재생 및 분석
- **제미나이 AI 실시간 검색 & 자동 데이터 수집 (Google Search Grounding)**: 매월 최신 미국/한국 거시경제 지표 19종을 원클릭으로 검색·검증하여 타임라인에 즉시 반영
- **제미나이 AI 매크로 심층 진단 (Executive Briefing)**: 현재 시뮬레이션 국면 및 자산군 가격 상태에 대한 헤지펀드 수석 이코노미스트 수준의 퀀트 리포트 실시간 생성
- **교과서 이론 vs 실제 시장 팩트체크**: 20가지 핵심 경제학 명제에 대한 실증적 반례 및 시장 심리 분석표 제공

---

## 🚀 빠른 시작 (Getting Started)

### 1. 레포지토리 복제 및 의존성 설치
```bash
git clone https://github.com/drag2k/macrodynamics.git
cd macrodynamics
npm install
```

### 2. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 Gemini API 키를 입력합니다:
```bash
cp .env.example .env
```
`.env` 내용:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

---

## 🌐 Vercel 배포 가이드 (Vercel Deployment)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdrag2k%2Fmacrodynamics&env=GEMINI_API_KEY)

본 프로젝트는 Vercel 배포를 위한 `vercel.json` 및 Serverless Functions (`/api/*`)를 기본 내장하고 있습니다.

### 방법 1: 1-Click 웹 배포 (가장 빠르고 간편함)
위의 **[Deploy with Vercel]** 버튼을 클릭하거나 [Vercel Clone 링크](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdrag2k%2Fmacrodynamics&env=GEMINI_API_KEY)에 접속하여 `GEMINI_API_KEY`만 입력하면 즉시 배포됩니다.

### 방법 2: GitHub 연동 웹 대시보드 배포
1. [Vercel 대시보드](https://vercel.com/new)에서 **`drag2k/macrodynamics`** 저장소를 선택(Import)합니다.
2. Framework Preset: **Vite** (자동 감지)
3. Root Directory: `./` (기본값)
4. **Environment Variables (환경 변수)** 설정:
   - Key: `GEMINI_API_KEY`
   - Value: `사용자의 Google Gemini API 키`
5. **Deploy** 버튼을 클릭하면 배포가 완료됩니다!

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion
- **AI Engine**: Google Gemini API (`@google/genai`), Google Search Grounding
- **Backend / Serverless**: Express, Node.js, Vercel Serverless Functions (`/api/*`)
- **Version Control & CI/CD**: Git, GitHub, Vercel

---

## 📄 저작권 및 라이선스 (License)

© 2026 **pandw Lee** (`pandw2k@gmail.com`). All rights reserved.
This project is authored and maintained by pandw Lee.
