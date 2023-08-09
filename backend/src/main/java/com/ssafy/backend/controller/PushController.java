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
        User hb = userRepository.findByUserId(userId).orElseThrow();
        User wk = userRepository.findByUserId(19L).orElseThrow();
        pushService.send(wk, hb, PushType.FOLLOW, wk.getName()+"님께서 회원님을 팔로우하기 시작했습니다.", "이동할 url");
    }
}