package com.ssafy.backend.repository;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
public interface PushRepository {
    //모든 emitter를 저장하는 ConcurrentHashMap
    //ConCurrentHashMap을 사용함으로써 멀티쓰레드 환경에서도 동시성을 유지할 수 있게 한다.

    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    //주어진 아이디와 Emitter를 가져온다.
    public SseEmitter get(Long id);

    //주어진 ID 와 Emitter를 제거
    public void deleteById(Long id);

    //주어진 아이디와 emitter를 저장한다.
    public void save(Long id, SseEmitter emitter);
}
