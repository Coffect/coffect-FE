# Commit Rules

## Commit Message Structure

커밋 메시지는 다음 구조를 따릅니다:

```
타입(스코프): 주제(제목)
```

| 타입 이름  | 내용                                |
|------------|------------------------------------|
| feat       | 새로운 기능에 대한 커밋              |
| fix        | 버그 수정에 대한 커밋               |
| chore      | 그 외 자잘한 수정에 대한 커밋 (ex package.json)  |
| docs       | 문서 수정에 대한 커밋 (ex README)              |
| refactor   | 코드 리팩토링에 대한 커밋 (기능 변경 없음)          |
| test       | 테스트 코드 수정에 대한 커밋        |

---

# Git Branch Rules

## Main and Develop Branch
- `main` 브랜치와 `develop` 브랜치는 본래 이름 그대로 사용합니다.

## Feature Branch
- `main`, `develop`, `release-...`, `hotfix-...` 브랜치를 제외한 다른 브랜치는 모두 기능별 브랜치로 사용합니다.
- 브랜치 이름 형식:
  ```
  feature/기능요약
  ```
  
  **예:**
  ```
  feature/login
  ```

## Release Branch
- 브랜치 이름 형식:
  ```
  release-...
  ```

  **예:**
  ```
  release-1.0
  ```

## Hotfix Branch
- 브랜치 이름 형식:
  ```
  hotfix-...
  ```

  **예:**
  ```
  hotfix-1.2.1
  ```
