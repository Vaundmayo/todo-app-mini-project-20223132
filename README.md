# 🚀 Full-Stack Todo App with Streak System

프론트엔드(React), 백엔드(Node.js), 데이터베이스(MongoDB)를 아우르는 풀스택 환경에서 구축된 할 일 관리 애플리케이션입니다. 단순한 CRUD 기능을 넘어, 사용자의 꾸준한 실천을 독려하기 위한 **스마트 스트릭(Streak) 시스템**이 구현되어 있습니다.

## 📅 프로젝트 개요
- **개발 목적**: 소프트웨어공학의 전체 프로세스(요구사항 분석 → 구현 → 테스팅 → 배포) 및 생성형 AI와의 협업 능력 배양
- **배포 플랫폼**: Vercel (Serverless 환경)

## 🛠 기술 스택
| 구분 | 기술 스택 | 사용 목적 |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | 컴포넌트 기반 UI 개발 및 고속 번들링 |
| **Backend** | Node.js + Express | RESTful API 서버 구축 및 비즈니스 로직 처리 |
| **Database** | MongoDB Atlas | 클라우드 기반 NoSQL DB를 이용한 데이터 영속성 확보 |
| **Styling** | Tailwind CSS | 유틸리티 퍼스트 방식을 통한 일관된 UI 디자인 |
| **Deployment** | Vercel | GitHub 연동을 통한 지속적 통합 및 자동 배포 (CI/CD) |

## ✨ 주요 기능 (Features)

### 1. 할 일 관리 (CRUD)
- 할 일 추가, 목록 조회, 완료 체크 및 삭제 기능 제공.
- 캘린더 형태의 날짜 선택기를 통한 날짜별 Todo 관리.

### 2. 스마트 스트릭(Streak) 시스템
- **엄격한 달성 조건**: 단순히 하나를 완료하는 것이 아니라, 해당 날짜에 등록된 **모든 할 일을 완료**해야 스트릭 카운트가 상승합니다.
- **유연한 오늘 보호**: 오늘 할 일을 아직 다 마치지 않았더라도, 어제까지의 기록이 끊기지 않도록 예외 처리가 적용되어 있습니다.
- **연속성 계산**: 오늘부터 과거로 거슬러 올라가며 연속 달성일을 자동 계산합니다.

### 3. UI/UX 최적화
- **페이지네이션**: 목록이 많아질 경우 가독성을 위해 한 페이지당 4개의 항목만 표시합니다.
- **반응형 디자인**: 다양한 기기 환경에서 최적화된 화면을 제공합니다.

## 🏗 프로젝트 구조
```text
.
├── backend/            # Express 서버 및 Mongoose 모델
│   ├── index.js        # API 라우팅 및 서버 설정
│   └── models/         # MongoDB 스키마 (Todo.js)
├── frontend/           # React 클라이언트
│   ├── src/App.jsx     # 메인 UI 및 스트릭 계산 로직
│   └── src/main.jsx    # React 진입점
└── vercel.json         # Vercel 배포 및 프록시 설정