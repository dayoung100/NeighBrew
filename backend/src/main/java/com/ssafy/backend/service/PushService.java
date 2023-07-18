package com.ssafy.backend.service;

import com.ssafy.backend.dto.PushDto;
import com.ssafy.backend.entity.Push;
import com.ssafy.backend.entity.PushType;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.EmitterRepository;
import com.ssafy.backend.repository.EmitterRepositoryImpl;
import com.ssafy.backend.repository.PushRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
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
        if(!lastEventId.isEmpty()){
            //유저 ID에 해당하는 모든 SSE 이벤트를 가져온다.
            Map<String, Object> events = emitterRepository.findAllEventCacheStartWithByMemberId(String.valueOf(id));

            //map을 전체 탐색을 수행함. 이벤트에 해당하는 값을 사전순으로 정렬해 이전 데이터를 먼저 push 알림 전송
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
                        //.name("sse") 이게뭐지
                        .data(data));
            } catch (IOException exception) {
                emitterRepository.deleteById(userId);
                emitter.completeWithError(exception);
            }
        });
    }

    private Push createPush(User receiver, PushType pushType, String content, String url){
        return Push.builder()
                .receiver(receiver)
                .pushType(pushType)
                .content(content)
                //url에 대한 컨벤션 정의가 필요할 듯 -> 클릭시 컨트롤러로 이동해야하니까
                .build();
    }
}
