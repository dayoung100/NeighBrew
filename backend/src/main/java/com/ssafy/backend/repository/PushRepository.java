package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Push;
import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// DB에 저장하기 위한 Repository
@Repository
public interface PushRepository extends JpaRepository<Push, Long> {
    List<Push> findAllByUser(User user);
    //findAllByReceiver : 모든 알림 목록을 조회할 때 사용한다. 아마 안쓸듯


}