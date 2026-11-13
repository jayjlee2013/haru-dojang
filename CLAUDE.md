# 하루도장 — 프로젝트 규칙

도장깨기식 생활 루틴앱. 구현·배포 완료 — 이후 작업은 기존 앱의 개선·추가다.

## 시작 절차

1. `docs/01-concept.md` → `docs/04-tech-spec.md` 순으로 읽는다.
2. 보류 중인 설계는 `docs/08-reward-design-notes.md`, 최근 변경은 `git log`로 파악한다.

## 작업 규칙

- 서브에이전트에 맡긴 작업은 자기 보고를 믿지 말고 테스트·빌드·브라우저로 직접 재검증한다 (M2·M5에서 PWA 연결 누락 등 실제 사고).
- `domain/` 수정은 TDD: 테스트 먼저 (RED → GREEN → IMPROVE). domain/ 커버리지 90%+.
- 콘텐츠 텍스트(관문 이름, 일지 25편)의 원본은 `docs/02-content-design.md`, UI 문구 전체의 원본은 `docs/06-microcopy.md`. 코드로 옮길 때 임의 수정·창작 금지. 06문서의 금지 목록(이모지·느낌표·응원 문구 등)을 위반하지 말 것.
- 날짜 계산은 date-fns만 사용. dayKey 규칙(하루 경계 기본 04시, 설정에서 0~23 변경 가능)은 `docs/04-tech-spec.md` 명세를 따른다.
