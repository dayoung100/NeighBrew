package com.ssafy.backend.controller;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.service.PushService;
import io.jsonwebtoken.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


@RestController
@RequestMapping("/api/push")
@CrossOrigin("*")
public class PushController {
    private final PushService pushService;
    private static final Logger logger = LoggerFactory.getLogger(PushController.class);

    //@Autowired
    public PushController(PushService pushService) {
        super();
        this.pushService = pushService;
    }

    //클라이언트에서 구독하기 위한 connect 메소드
    //@GetMapping(value = "/connect/{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @GetMapping(value = "connect/{userId}", produces = "text/event-stream")
    @ResponseStatus(HttpStatus.OK)
    public SseEmitter connect(@PathVariable Long userId,
                              @RequestHeader(value = "Last-Event-ID", required= false, defaultValue = "") String lastEventId) throws IOException {
        logger.info("@@@@@@@@@@@ 연결 시도 => id :{}, lastEventId {}\n", userId, lastEventId);

        //클라이언트로 전달되는 것이 아닌, 클라이언트에게 지속적으로 알림을 제공하기 위한 연결 통로를 생성한다.
        return pushService.connect(userId, lastEventId);
    }
    //================================================
    //              알람을 위한 더미 테스트
    //================================================
    @GetMapping(value = "/follow/{userId}", produces = "text/event-stream")
    public void pushFollow(@PathVariable Long userId) {
        logger.info("팔로우 알림 접근");
        pushService.send(userId, PushType.FOLLOW, "유저 2님께서 회원님을 팔로우하기 시작했습니다.", "이동할 url");
    }
    @GetMapping(value = "/comment/{userId}", produces = "text/event-stream")
    public void pushComment(@PathVariable Long userId) {
        logger.info("댓글 알림 접근");
        pushService.send(userId, PushType.FOLLOW, "유저 2님께서 회원님의 게시글에 공감을 표현했습니다.", "이동할 url");
    }
    @GetMapping(value = "/chat/{userId}", produces = "text/event-stream")
    public void pushChat(@PathVariable Long userId) {
        logger.info("채팅 알림 접근");
        pushService.send(userId, PushType.CHAT, "유저 2님께서 회원님께 메세지를 보냈습니다.", "이동할 url");
    }
    @GetMapping(value = "/accept/{userId}", produces = "text/event-stream")
    public void pushAccept(@PathVariable Long userId) {
        logger.info("수락 알림 접근");
        pushService.send(userId, PushType.MEETACCESS, "모임A 신청에 수락되셨습니다.", "이동할 url");
    }
    @GetMapping(value = "/reject/{userId}", produces = "text/event-stream")
    public void pushReject(@PathVariable Long userId) {
        logger.info("거절 알림 접근");
        pushService.send(userId, PushType.MEETREJECT, "모임A 신청에 거절되셨습니다.", "이동할 url");
    }
    @GetMapping(value = "/evaluation/{userId}", produces = "text/event-stream")
    public void pushEval(@PathVariable Long userId) {
        logger.info("평가 알림 접근");
        pushService.send(userId, PushType.MEETEVALUATION, "모임A에 대한 평가를 진행해 주세요", "이동할 url");
    }
}
