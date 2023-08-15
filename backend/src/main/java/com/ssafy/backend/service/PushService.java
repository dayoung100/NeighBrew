package com.ssafy.backend.service;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.entity.Push;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.EmitterRepositoryImpl;
import com.ssafy.backend.repository.PushRepository;
import com.ssafy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class PushService {
    //타임아웃 설정 - 10분으로 연결 설정한다.
    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60 * 24;
    private final EmitterRepositoryImpl emitterRepository = new EmitterRepositoryImpl();

    private final PushRepository pushRepository;
    private final UserRepository userRepository;


    public SseEmitter connect(Long userId, String lastEventId) {
        log.info("연결 : {}", lastEventId);
        //새로운 Ssemitter를 만든 후, userId에 맞는 emitter 저장
        String sseEmitterId = makeTimeIncludeId(userId);
        SseEmitter sseEmitter = emitterRepository.save(sseEmitterId, new SseEmitter(DEFAULT_TIMEOUT));

        //세션이 종료될 경우 저장한 SSEEmitter를 삭제한다.
        sseEmitter.onCompletion(() -> emitterRepository.deleteById(sseEmitterId));
        sseEmitter.onTimeout(() -> emitterRepository.deleteById(sseEmitterId));

        // 503 에러가 발생하지 않도록 더미 데이터를 보내 연결을 유지한다.
        String eventId = makeTimeIncludeId(userId); //개별 알림 이벤트를 식별하기 위한 값
        sendEventToClient(sseEmitter, eventId, sseEmitterId, "sse", "EventStream Created. [userId= " + userId + "]");

        //클라이언트가 미수신한 Event목록이 있을 경우 전송해 event 유실을 예방한다.
        if (!lastEventId.isEmpty()) {
            log.info("미수신 목록");
            // 미수신 목록들 DB에 저장 -> 상태 고려하여 작성해야함
            sendLostData(lastEventId, userId, sseEmitterId, sseEmitter);
            // 미수신 목록들 전송했으므로 이벤트 캐시 삭제
            emitterRepository.deleteAllEventCacheStartWithId(String.valueOf(userId));
        }
        return sseEmitter;
    }

    private void sendLostData(String lastEventId, Long userId, String emitterId, SseEmitter emitter) {
        //유저 ID에 해당하는 모든 SSE 이벤트를 가져온다.
        Map<String, Object> eventCaches = emitterRepository.findAllEventCacheStartWithByUserId(String.valueOf(userId));

        //클라이언트로 마지막에 보낸 eventId와 eventCache에 저장된 eventId를 비교한다.
        //lastEventId 보다 크면 서버와 연결이 끊겼을 때 생성된 이벤트 이므로 클라이언트에게 보내준다.
        eventCaches.entrySet().stream()
                .filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
                .forEach(entry -> sendEventToClient(emitter, entry.getKey(), emitterId, PushType.LOSTDATA.name(), entry.getValue()));
    }

    //SseEmitter 객체를 사용하여 SSE를 클라이언트에게 전송하는 역할
    private void sendEventToClient(SseEmitter sseEmmitter, String eventId, String sseEmitterId, String eventName, Object data) {
        try {
            // if(eventName.equals("sse")){
            //     sseEmmitter.send(SseEmitter.event()
            //             .id(eventId) //이벤트 고유 식별자
            //             .name(eventName) //이벤트 이름 지정
            //             .data(data)); //이벤트로 전송할 데이터 설정
            // }else{
            sseEmmitter.send(SseEmitter.event()
                    .id(eventId) //이벤트 고유 식별자
                    //.name(eventName) //이벤트 이름 지정
                    .data(data)); //이벤트로 전송할 데이터 설정
            // }

        } catch (IOException e) {
            emitterRepository.deleteById(sseEmitterId);
            sseEmmitter.completeWithError(e);
        }
    }

    //알림을 생성하고 지정된 수신자에게 알림을 전송하는 기능 수행
    public void send(User sender, User receiver, PushType pushType, String content, String url) {
        //Push 객체를 생성 및 저장
        try {
            Push push = pushRepository.save(createPush(sender, receiver, pushType, content, url));
            Long receiverId = receiver.getUserId();
            String eventId = makeTimeIncludeId(receiverId);

            //로그인 한 유저의 모든 Emiiter를 불러온다
            Map<String, SseEmitter> sseEmitters = emitterRepository.findAllEmitterStartWithByUserId(String.valueOf(receiverId));
            sseEmitters.forEach(
                    (key, emitter) -> {
                        log.info("전송 key {} ", key);
                        emitterRepository.saveEventCache(key, push.toDto());//데이터 캐시를 저장한다(유실된 데이터가 발생할 경우 처리하기 위함
                        sendEventToClient(emitter, eventId, key, pushType.name(), push.toDto());//데이터를 receiver에게 전송
                    }
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Push createPush(User sender, User receiver, PushType pushType, String content, String url) {
        return Push.builder()
                .receiver(receiver)
                .sender(sender)
                .pushType(pushType)
                .content(content)
                .url(url)//url에 대한 컨벤션 정의가 필요할 듯 -> 클릭시 컨트롤러로 이동해야하니까
                .isRead(false)
                .build();
    }

    //id에 이벤트가 발생한 시간을 더해 유실된 데이터를 찾을 수 있도록 한다.
    private String makeTimeIncludeId(Long memberId) {
        return memberId + "_" + System.currentTimeMillis();
    }

    @Transactional
    public void deletePushLog(PushType pushType, Long senderId, Long receiverId) {
        pushRepository.deleteByPushTypeAndSender_UserIdAndReceiver_UserId(pushType, senderId, receiverId);
    }

    public List<Push> getUserPushLog(Long userId) {
        return pushRepository.findByReceiver_UserIdOrderByCreatedAtDesc(userId);
    }
}
