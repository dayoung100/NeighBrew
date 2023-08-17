package com.ssafy.backend.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Repository
public class EmitterRepositoryImpl implements EmitterRepository {
    //모든 emitter를 저장하는 ConcurrentHashMap
    //ConCurrentHashMap을 사용함으로써 멀티쓰레드 환경에서도 동시성을 유지할 수 있게 한다.

    private final ConcurrentHashMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    //클라이언트 연결을 잃어도 이벤트 유실을 방지하기 위해 임시 저장
    private final ConcurrentHashMap<String, Object> eventCache = new ConcurrentHashMap<>();

    //Emitter 저장
    @Override
    public SseEmitter save(String sseEmitterId, SseEmitter sseEmitter) {
        //log.info("EmitterRepository 잡속, {}, {} ", sseEmitterId, sseEmitter);
        log.info("emitter 저장 : {}", sseEmitterId);

        emitters.put(sseEmitterId, sseEmitter);

        return sseEmitter;
    }

    //Event 저장
    @Override
    public void saveEventCache(String eventCacheId, Object event) {
        log.info("saveEventCache 접근 {} ", eventCacheId);
        eventCache.put(eventCacheId, event);
    }

    //회원과 관련된 Emitter를 모두 찾음
    @Override
    public Map<String, SseEmitter> findAllEmitterStartWithByUserId(String userId) {
        return emitters.entrySet().stream()
                //sseEmitte의 key들은 userId_currentTime 형태여서 suffix가 userId인것만 찾게 한다.
                .filter(entry -> entry.getKey().split("_")[0].equals(userId))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    //회원과 관련된 Event 모두 찾음
    @Override
    public Map<String, Object> findAllEventCacheStartWithByUserId(String userId) {
        return eventCache.entrySet().stream()
                //sseEmitte의 key들은 userId_currentTime 형태여서 suffix가 userId인것만 찾게 한다.
                .filter(entry -> entry.getKey().split("_")[0].equals(userId))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    //주어진 ID 와 Emitter를 제거
    @Override
    public void deleteById(String sseEmitterId) {
        emitters.remove(sseEmitterId);
    }

    //회원과 관련된 모든 Emitter 제거
    @Override
    public void deleteAllEmitterStartWithId(String userId) {
        emitters.forEach(
                (key, emitter) -> {
                    //sseEmitte의 key들은 userId_currentTime 형태여서 suffix가 userId인것만 찾아 삭제한다.
                    if (key.split("_")[0].equals((userId))) {
                        emitters.remove(key);
                    }
                }
        );

    }

    //회원과 관련된 모든 이벤트 제거
    @Override
    public void deleteAllEventCacheStartWithId(String userId) {
        eventCache.forEach(
                (key, emitter) -> {
                    //sseEmitte의 key들은 userId_currentTime 형태여서 suffix가 userId인것만 찾아 삭제한다.
                    if (key.split("_")[0].equals(userId)) {
                        eventCache.remove(key);
                    }
                }
        );
    }
}
/* 구현 참고링크
https://pizzathedeveloper.tistory.com/entry/TIL-%EC%8A%A4%ED%94%84%EB%A7%81-%EC%95%8C%EB%A6%BC-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-SSE-Server-Sent-Event-230111
https://jsonobject.tistory.com/558
https://gilssang97.tistory.com/69
https://velog.io/@max9106/Spring-SSE-Server-Sent-Events%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%8B%A4%EC%8B%9C%EA%B0%84-%EC%95%8C%EB%A6%BC
https://tecoble.techcourse.co.kr/post/2022-10-11-server-sent-events/
*
* */