package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatDmRoom;
import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;

@Repository
public interface ChatDmRoomRepository extends JpaRepository<ChatDmRoom, Long> {

    @Query("select cdr from ChatDmRoom cdr where (cdr.user1 = :user1 and cdr.user2 = :user2) or (cdr.user1 = :user2 and cdr.user2 = :user1)")
    Optional<ChatDmRoom> findDmUsers(@Param("user1") User user1,
                                     @Param("user2") User user2);

    @Transactional
    @Modifying
    @Query("UPDATE ChatDmRoom c SET c.user1 = NULL WHERE c.chatDmRoomId = :roomId")
    void removeUser1FromChatRoom(@Param("roomId") Long roomId);

    @Transactional
    @Modifying
    @Query("UPDATE ChatDmRoom c SET c.user2 = NULL WHERE c.chatDmRoomId = :roomId")
    void removeUser2FromChatRoom(@Param("roomId") Long roomId);

}