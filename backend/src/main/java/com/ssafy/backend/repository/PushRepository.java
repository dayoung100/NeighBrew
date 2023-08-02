package com.ssafy.backend.repository;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.entity.Push;
import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

// DB에 저장하기 위한 Repository
@Repository
public interface PushRepository extends JpaRepository<Push, Long> {
    List<Push> findByReceiverUserId(Long receiverId);
    //findAllByReceiver : 모든 알림 목록을 조회할 때 사용한다. 아마 안쓸듯

    @Modifying
    @Query("DELETE FROM Push p WHERE p.pushType = :pushType AND p.receiver.userId = :receiverId AND p.sender.userId = :senderId")
    void deleteByPushTypeAndSender_UserIdAndReceiver_UserId(@Param("pushType") PushType pushType,
                                                            @Param("senderId") Long senderId,
                                                            @Param("receiverId") Long receiverId);




    //void deleteByPushTypeAndReceiver_UserIdAndSender_UserId(PushType pushType, Long receiverId, Long senderId);
}




