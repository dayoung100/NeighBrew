package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Push;
import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * sseEmitter를 이용해 알림을 실제 보내게 되는데, 어떤 회원에게 어떤 emitter가 연결 되어 있는지 저장해야함
 * 어떤 이벤트들이 현재 발생했는지도 저장(추후 emitter 연결 끊길 경우 이어서 전송해줘야하기 때문)
 * => EnitterRepository인 이유
 * */
@Repository
public interface PushRepository extends JpaRepository<Push, Long> {
    List<Push> findAllByUser(User user);
    //findAllByReceiver : 모든 알림 목록을 조회할 때 사용한다. 아마 안쓸듯
}