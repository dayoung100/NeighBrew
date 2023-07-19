package com.ssafy.backend.controller;

import com.ssafy.backend.dto.UserDto;
import com.ssafy.backend.entity.PushType;
import com.ssafy.backend.service.PushService;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


@RestController
@RequestMapping("/push")
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
    @GetMapping(value = "follow", produces = "text/event-stream")
    public void pushFollow(@RequestBody UserDto targetUser,
                           @RequestBody UserDto followUser) throws Exception {
        logger.info("팔로우 알림 접근");
        pushService.send(1L, PushType.Follow, "유저 2님께서 회원님을 팔로우하기 시작했습니다.", "이동할 url");
    }
    @GetMapping(value = "comment", produces = "text/event-stream")
    public void pushComment() throws Exception {
        logger.info("댓글 알림 접근");
        pushService.send(1L, PushType.Follow, "유저 2님께서 회원님의 게시글에 공감을 표현했습니다.", "이동할 url");
    }
    @GetMapping(value = "chat", produces = "text/event-stream")
    public void pushChat() throws Exception {
        logger.info("채팅 알림 접근");
        pushService.send(1L, PushType.Follow, "유저 2님께서 회원님께 메세지를 보냈습니다.", "이동할 url");
    }
    @GetMapping(value = "accept", produces = "text/event-stream")
    public void pushAccept() throws Exception {
        logger.info("수락 알림 접근");
        pushService.send(1L, PushType.Follow, "모임A 신청에 수락되셨습니다.", "이동할 url");
    }
    @GetMapping(value = "reject", produces = "text/event-stream")
    public void pushReject() throws Exception {
        logger.info("거절 알림 접근");
        pushService.send(1L, PushType.Follow, "모임A 신청에 거절되셨습니다.", "이동할 url");
    }
    @GetMapping(value = "evaluation", produces = "text/event-stream")
    public void pushEval() throws Exception {
        logger.info("평가 알림 접근");
        pushService.send(1L, PushType.Follow, "모임A에 대한 평가를 진행해 주세요", "이동할 url");
    }
}
