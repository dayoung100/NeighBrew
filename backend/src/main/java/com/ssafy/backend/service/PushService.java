package com.ssafy.backend.service;

import com.ssafy.backend.repository.EmitterRepository;
import com.ssafy.backend.repository.EmitterRepositoryImpl;
import com.ssafy.backend.repository.PushRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
public class PushService {
    //타임아웃 설정 - 10분으로 연결 설정한다.
    private static final Long DEFAULT_TIMEOUT = 60L  * 1000 * 10;

    private final EmitterRepository emitterRepository = new EmitterRepositoryImpl();
    private final PushRepository pushRepository;

    @Autowired
    public PushService(PushRepository pushRepository) {
        this.pushRepository = pushRepository;
    }

    public SseEmitter connect(Long id, String lastEventId) {
        //id에 이벤트가 발생한 시간을 더해 유실된 데이터를 찾을 수 있도록 한다.
        String emitterId = id + "_" + System.currentTimeMillis();
        //새로운 Ssemitter를 만든다.
        SseEmitter sseEmitter = emitterRepository.save(emitterId, new SseEmitter(DEFAULT_TIMEOUT));

        //세션이 종료될 경우 저장한 SSEEmitter를 삭제한다.
        sseEmitter.onCompletion(() -> emitterRepository.deleteById(emitterId)); //연결이
        sseEmitter.onTimeout(() -> emitterRepository.deleteById(emitterId));

        // 503 에러가 발생하지 않도록 더미 데이터를 보내 연결을 유지한다.
        sendToClient(sseEmitter, emitterId, "EventStream Created. [userId= " + id + "]");

        //클라이언트가 미수신한 Event목록이 있을 경우 전송해 event 유실을 예방한다.
        if(!lastEventId.trim().equals("")){
            Map<String, Object> events = emitterRepository.findAllEventCacheStartWithByMemberId(String.valueOf(id));
            events.entrySet().stream()
                    .filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
                    .forEach(entry -> sendToClient(sseEmitter, entry.getKey(), entry.getValue()));
        }

        return sseEmitter;

    }


    //클라이언트에게 데이터를 전송하는 메소드
    private void sendToClient(SseEmitter emmitter, String userId, Object data){
        Optional<SseEmitter> emitterOptional =
                Optional.ofNullable(emmitter);

        emitterOptional.ifPresent(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                        .id(userId)
                        .name("sse")
                        .data(data));
            } catch (IOException exception) {
                emitterRepository.deleteById(userId);
                emitter.completeWithError(exception);
            }
        });
    }
}
