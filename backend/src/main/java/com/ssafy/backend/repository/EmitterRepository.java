package com.ssafy.backend.repository;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.Optional;

public interface EmitterRepository {
    //Emitter 저장
    SseEmitter save(String sseEmitterId, SseEmitter sseEmitter);
    //Event 저장
    void saveEventCache(String sseEmitterId, Object event);
    //회원과 관련된 Emitter를 모두 찾음
    Map<String, SseEmitter> findAllEmitterStartWithByUserId(String userId);

    //회원과 관련되s Event 모두 찾음
    Map<String, Object> findAllEventCacheStartWithByUserId(String userId);

    //Emitter를 지움
    void deleteById(String emitterId);

    //회원과 관련된 모든 Emitter 제거
    void deleteAllEmitterStartWithId(String userId);
    //회원과 관련된 모든 이벤트 제거
    void deleteAllEventCacheStartWithId(String userId);

}
