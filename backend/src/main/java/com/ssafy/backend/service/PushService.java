package com.ssafy.backend.service;

import com.ssafy.backend.repository.PushRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Optional;

@Service
public class PushService {
    //타임아웃 설정 - 30분으로 연결 설정한다.
    private static final Long DEFAULT_TIMEOUT = 60L  * 1000 * 30;
    private final PushRepository pushRepository;

    @Autowired
    public PushService(PushRepository pushRepository) {
        this.pushRepository = pushRepository;
    }

    /**
     * 클라이언트가 구독을 위해 호출하는 메소드
     * @Param userId : 구독하는 클라이언트의 사용자 아이디
     * @return emitter : 서버에서 보낸 이벤트 emitter
     * */
    public SseEmitter connect(Long userId){
        SseEmitter emitter = createEmitter(userId);

        //처음 구독 시, 최초의 메세지를 연결 대기 상태나 연결 요청 오류를 막을 수 있다.
        sendToClient(userId, "Event Stream Created. [userId =" + userId + "]");
        return emitter;
    }

    /**
     * 서버 이벤트 클라이언트로 보낸다.
     * @param userId : 메세지를 전송할 사용자 ID
     * @Param event : 다른 서비스 로직에서 해당 메서드를 통해 데이터를 전송할 수 있다.
     */
    public void notify(Long userId, Object event){
        sendToClient(userId, event);
    }

    /**
     * 클라이언트에게 데이터를 전송
     * @Param userId : 데이터를 전송받을 사용자의 아이디
     * @Param data : 전송할 데이터
     * */
    private void sendToClient(Long id, Object data){
        Optional<SseEmitter> emitterOptional =
                Optional.ofNullable(pushRepository.get(id));

        emitterOptional.ifPresent(emitter -> {
            try {
                emitter.send(SseEmitter.event().id(String.valueOf(id)).name("sse").data(data));
            } catch (IOException exception) {
                pushRepository.deleteById(id);
                emitter.completeWithError(exception);
            }
        });
    }

    /**
     * 사용자 아이디를 기반으로 이벤트 Emitter를 생성
     *
     * @param id - 사용자 아이디.
     * @return SseEmitter - 생성된 이벤트 Emitter.
     */
    private SseEmitter createEmitter(Long id) {
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        pushRepository.save(id, emitter);

        // Emitter가 완료될 때(모든 데이터가 성공적으로 전송된 상태) Emitter를 삭제한다.
        emitter.onCompletion(() -> pushRepository.deleteById(id));
        // Emitter가 타임아웃 되었을 때(지정된 시간동안 어떠한 이벤트도 전송되지 않았을 때) Emitter를 삭제한다.
        emitter.onTimeout(() -> pushRepository.deleteById(id));

        return emitter;
    }


}
