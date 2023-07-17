package com.ssafy.backend.repository;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class EmitterRepositoryImpl implements EmitterRepository {
    //모든 emitter를 저장하는 ConcurrentHashMap
    //ConCurrentHashMap을 사용함으로써 멀티쓰레드 환경에서도 동시성을 유지할 수 있게 한다.

    //member와 관련된 모든 emitter를 찾는다.
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    //member와 관련된 모든 event를 찾는다.
    private final Map<String, Object> eventCache = new ConcurrentHashMap<>();

    //주어진 아이디와 emitter를 저장한다.
    public SseEmitter save(String emitterId, SseEmitter emitter){
        emitters.put(emitterId, emitter);
        return emitter;
    };

    public void saveEventCache(String emitterId, Object event) {
        eventCache.put(emitterId,event);
    }

    public Map<String, SseEmitter> findAllEmitterStartWithByMemberId(String memberId) {
        return emitters.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(memberId))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public Map<String, Object> findAllEventCacheStartWithByMemberId(String memberId) {
        return eventCache.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(memberId))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }


    //주어진 ID 와 Emitter를 제거
    public void deleteById(String emitterId){
        emitters.remove(emitterId);
    };

    public void deleteAllEmitterStartWithId(String memberId) {
        emitters.forEach(
                (key,emitter) -> {
                    if(key.startsWith(memberId)){
                        emitters.remove(key);
                    }
                }
        );
    }

    public void deleteAllEventCacheStartWithId(String memberId) {
        eventCache.forEach(
                (key,emitter) -> {
                    if(key.startsWith(memberId)){
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