package com.ssafy.backend.controller;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.PushService;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/push")
@Slf4j
public class PushController {
    private final PushService pushService;
    private final UserRepository userRepository;

    @GetMapping(value = "/connect/{userId}", produces = "text/event-stream")
    @ResponseStatus(HttpStatus.OK)
    public SseEmitter connect(@PathVariable Long userId,
                              @RequestHeader(value = "Last-Event-ID", required = false, defaultValue = "") String lastEventId) throws IOException {
        //log.info("@@@@@@@@@@@ 연결 시도 => id :{}, lastEventId {}\n", userId, lastEventId);
        log.info("{}", lastEventId);
        //클라이언트로 전달되는 것이 아닌, 클라이언트에게 지속적으로 알림을 제공하기 위한 연결 통로를 생성한다.
        return pushService.connect(userId, lastEventId);
    }
    @GetMapping(value = "/follow/{userId}", produces = "text/event-stream")
    public void pushFollow(@PathVariable Long userId) {
        log.info("왔나");
        User hb = userRepository.findByUserId(18L).orElseThrow();
        User wk = userRepository.findByUserId(19L).orElseThrow();
        pushService.send(wk, hb, PushType.FOLLOW, "유저 2님께서 회원님을 팔로우하기 시작했습니다.", "이동할 url");
    }
}
/* 원격 서버 헤더를 가지고 오고 싶을 경우 origin에 응답해야함
let source = new EventSource("https://another-site.com/events", {
  withCredentials: true
});
혹은
const evtSource = new EventSource("//api.example.com/ssedemo.php", { withCredentials: true } );

연결이 끊어지면 막 메세지 마다 Id를 필요로 하게 된다.
-> Last-Event-ID를 헤더에 포함해서 보내야함

클라이언트에서 eventSource의 이벤트 종류
message : 서버로 부터 데이터가 왔을 때 처리 하는 메소드
open : 첫 connection
error : 에러 발생


서버 응답 형식 데이터
data :
id :
retry:
event :

>> nginx 도입 시 주의사항 <<
nginx는 was로 http/1.0 데이터만 보내므로 1.1로 설정을 바꿔줘야한다.
proxy_set_header Connection '';
proxy_http_version 1.1;
* */

//================================================
//              알람을 위한 더미 테스트
//================================================

//
//    @GetMapping(value = "/comment/{userId}", produces = "text/event-stream")
//    public void pushComment(@PathVariable Long userId) {
//        logger.info("댓글 알림 접근");
//        pushService.send(userId, PushType.FOLLOW, "유저 2님께서 회원님의 게시글에 공감을 표현했습니다.", "이동할 url");
//    }
//
//    @GetMapping(value = "/chat/{userId}", produces = "text/event-stream")
//    public void pushChat(@PathVariable Long userId) {
//        logger.info("채팅 알림 접근");
//        pushService.send(userId, PushType.CHAT, "유저 2님께서 회원님께 메세지를 보냈습니다.", "이동할 url");
//    }
//
//    @GetMapping(value = "/accept/{userId}", produces = "text/event-stream")
//    public void pushAccept(@PathVariable Long userId) {
//        logger.info("수락 알림 접근");
//        pushService.send(userId, PushType.MEETACCESS, "모임A 신청에 수락되셨습니다.", "이동할 url");
//    }
//
//    @GetMapping(value = "/reject/{userId}", produces = "text/event-stream")
//    public void pushReject(@PathVariable Long userId) {
//        logger.info("거절 알림 접근");
//        pushService.send(userId, PushType.MEETREJECT, "모임A 신청에 거절되셨습니다.", "이동할 url");
//    }
//
//    @GetMapping(value = "/evaluation/{userId}", produces = "text/event-stream")
//    public void pushEval(@PathVariable Long userId) {
//        logger.info("평가 알림 접근");
//        pushService.send(userId, PushType.MEETEVALUATION, "모임A에 대한 평가를 진행해 주세요", "이동할 url");
//    }
