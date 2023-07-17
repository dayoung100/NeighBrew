## 사용 스택

- React
- react-router-dom
- TypeScript
- styled-components
- @tanstack/react-query
- redux-toolkit
- axios
- auto-animate
- @vitejs/plugin-pwa
- ngrok // 테스트용, 추후 삭제 예정
- @stomp/stompjs
- sockjs-client

### ngrok 사용법

- npm install -g ngrok
- ngrok http 5173 -> 아이디 만들기 -> 만들고 밑에 token 받기
- token 사이트에서 2. Connect your account 탭에서 명령어 복사, 터미널에서 입력
- 이제 ngrok에서 orwarding에 있는 주소로 접속 가능
-

### prettier 설정

```
{
  // "terminal.integrated.defaultProfile.windows": "Git Bash",
  // "files.associations": {
  //   "**/*.html": "html",
  //   "**/templates/**/*.html": "django-html",
  //   "**/templates/**/*": "django-txt",
  //   "**/requirements{/**,*}.{txt,in}": "pip-requirements"
  // },
  // "emmet.includeLanguages": {
  //   "django-html": "html"
  // },
  // "python.pythonPath": "venv\\Scripts\\python.exe",
  // "[vue]": {
  //   "editor.defaultFormatter": "Wscats.vue"
  // },
  // "terminal.integrated.enableMultiLinePasteWarning": false,
  // "emmet.syntaxProfiles": {
  //   "javascript": "jsx"
  // },
  // "emmet.includeLanguages": {
  //   "javascript": "html"
  // },
  // "editor.linkedEditing": true,
  // "window.zoomLevel": 2,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "redhat.telemetry.enabled": true,
  "javascript.format.enable": false,
  "editor.formatOnSave": true,
  "prettier.arrowParens": "avoid",
  "prettier.tabWidth": 2,
  "prettier.semi": true,
  "prettier.singleQuote": false,
  "prettier.printWidth": 100,
  "prettier.trailingComma": "es5",
  "editor.inlineSuggest.enabled": true
}
```

## 개발 참고사항

- 해상도는 아이폰 14 크기인 393\*844 기준으로 개발 (https://kka7.tistory.com/46)
