## ✔ **Git 커밋 메시지 컨벤션**

- `Feat` : 새로운 기능 추가
- `Modify` : 기존 기능 수정
- `Fix` : 버그 수정
- `Docs` : 문서 내용 변경
- `Style` : 포맷, 세미콜론 수정 등 코드가 아닌 스타일에 관련된 수정
- `Refactor` : 코드 리팩토링
- `Test`: 테스트 코드 추가 및 리팩토링 테스트 등
- `Build` : 빌드 관련 파일 수정
- `Chore` : 코드 의미에 영향을 주지 않는 변경사항 (포맷, 세미콜론 누락, 공백 등)
- `CI` : CI 관련 설정 수정에 대한 커밋
- 커밋 타입은 **대문자**로 시작하며, 항상 대괄호 안에 파트를 입력하여 시작
- 관련된 지라 이슈 번호에 괄호를 붙여 뒤에 추가.

ex) **[BE] Feat: 관심지역 알림 ON/OFF 기능 추가(#123)**

<br>

## ✔ **Git 브랜치 컨벤션**

![git_strategy](./docsResource/branchConvention.png)

- `main`
    - 배포 가능한 상태의 결과물 올리는 브랜치
- `develop`
    - 구현 완료된 기능을 병합하기 위한 브랜치
    - 통합 폴더의 기능
- `feature`
    - 개별 기능 구현 브랜치
    - 기능 개발 완료 시 삭제
    - 네이밍 규칙
        - feature/FE or BE/기능이름
        - 예) feature/FE/login
          <br><br>
- **feature 브랜치가 완성되면 develop 브랜치로 merge request를 통해 merge한다.**<br>
  ⇒ merge request가 요청되면, 모든 팀원들이 코드 리뷰를 하여 안전하게 merge한다.

<br>