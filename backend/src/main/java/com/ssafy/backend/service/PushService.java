package com.ssafy.backend.service;

import com.ssafy.backend.dto.PushDto;
import com.ssafy.backend.entity.Push;
import com.ssafy.backend.entity.PushType;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.EmitterRepository;
import com.ssafy.backend.repository.EmitterRepositoryImpl;
import com.ssafy.backend.repository.PushRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;

@Service
public class PushService {
    //타임아웃 설정 - 10분으로 연결 설정한다.
    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 10;

    private static final Logger logger = LoggerFactory.getLogger(PushService.class);
    private final EmitterRepository emitterRepository = new EmitterRepositoryImpl();
    private final PushRepository pushRepository;

    @Autowired
    public PushService(PushRepository pushRepository) {
        this.pushRepository = pushRepository;
    }

    public SseEmitter connect(String id, String lastEventId) {

        logger.info("PushService 접근 : 접근 유저 id {}", id);

        //새로운 Ssemitter를 만든다.
        String sseEmitterId = makeTimeIncludeId(id);
        SseEmitter sseEmitter = emitterRepository.save(sseEmitterId, new SseEmitter(DEFAULT_TIMEOUT));

        //세션이 종료될 경우 저장한 SSEEmitter를 삭제한다.
        sseEmitter.onCompletion(() -> emitterRepository.deleteById(sseEmitterId));
        sseEmitter.onTimeout(() -> emitterRepository.deleteById(sseEmitterId));

        // 503 에러가 발생하지 않도록 더미 데이터를 보내 연결을 유지한다.
        sendToClient( sseEmitter, "Init Connect", makeTimeIncludeId(id), "EventStream Created. [userId= " + id + "]");

        //클라이언트가 미수신한 Event목록이 있을 경우 전송해 event 유실을 예방한다.
        if (!lastEventId.isEmpty()) {
            sendLostData(lastEventId, id, sseEmitterId, sseEmitter);
        }else{
            logger.info(">> 미수신 목록이 없음 <<");
        }
        return sseEmitter;
    }

    //클라이언트에게 데이터를 전송하는 메소드
    private void sendToClient(SseEmitter sseEmmitter, String eventId, String sseEmitterId, Object data) {
        try {
            sseEmmitter.send(SseEmitter.event()
                    .id(eventId)
                    .data(data));
        } catch (IOException e) {
            emitterRepository.deleteById(sseEmitterId);
            sseEmmitter.completeWithError(e);
        }
    }

    private void sendLostData(String lastEventId, String userId, String emitterId, SseEmitter emitter) {
        //유저 ID에 해당하는 모든 SSE 이벤트를 가져온다.
        Map<String, Object> eventCaches = emitterRepository.findAllEventCacheStartWithByUserId(String.valueOf(userId));
        eventCaches.entrySet().stream()
                //map을 전체 탐색을 수행함. 이벤트에 해당하는 값을 사전순으로 정렬해 이전 데이터를 먼저 push 알림 전송
                .filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
                .forEach(entry -> sendToClient(emitter, entry.getKey(), emitterId, entry.getValue()));
    }

    /**
     * 알림을 보내고 싶은 controller, Service에서 send메소드를 호출해주면 된다.
     *
     * @Param receiver : 이벤트를 받을 유저
     * @Param pushType : enum형태의 pushType을 지정해준다
     * @Param content : 전송할 메세지 내용
     * @Param url : redirect할 URL 정보 입력
     */


    //public void send(User receiver, PushType pushType, String content, String url) {
    //  Push push = pushRepository.save(createPush(receiver, pushType, content, url));
    //  DB체크 완료되면 수행해야함, 유저 객체를 용해야하기 떄문
    public void send(String id, PushType pushType, String content, String url) {
        PushDto pushDto = new PushDto();
        pushDto.setId(1L);
        pushDto.setContent(content);
        pushDto.setUrl(url);
        pushDto.setCreatedAt(String.valueOf(System.currentTimeMillis()));

        String receiverId = String.valueOf(id);
        String eventId = makeTimeIncludeId(id);

        //로그인 한 유저의 모든 Emiiter를 불러온다
        Map<String, SseEmitter> sseEmitters = emitterRepository.findAllEmitterStartWithByUserId(receiverId);
        if(sseEmitters == null ) logger.info("null임ㅋ");
        sseEmitters.forEach(
                (key, emitter) -> {
                    logger.info("정보 출력 {}, {} ", key, emitter.getTimeout());
                    emitterRepository.saveEventCache(key, pushDto);//데이터 캐시를 저장한다(유실된 데이터가 발생할 경우 처리하기 위함
                    sendToClient( emitter,eventId, key, pushDto);//데이터를 receiver에게 전송
                }
        );
    }
    private Push createPush(User receiver, PushType pushType, String content, String url) {
        return Push.builder()
                .user(receiver)
                .pushType(pushType)
                .content(content)
                .url(url)//url에 대한 컨벤션 정의가 필요할 듯 -> 클릭시 컨트롤러로 이동해야하니까
                .isRead(false)
                .build();
    }

    //id에 이벤트가 발생한 시간을 더해 유실된 데이터를 찾을 수 있도록 한다.
    private String makeTimeIncludeId(String memberId) {
        return memberId + "_" + System.currentTimeMillis();
    }



}
/*
public enum PushType {
    CommentLike, Follow, Following, SingleChat, MeetChat, MeetAccess, MeetReject, MeetEvaluation
}
 */