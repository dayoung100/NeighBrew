package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatDmRoom;
import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatDmRoomRepository extends JpaRepository<ChatDmRoom, Long> {

    @Query("select cdr from ChatDmRoom cdr where (cdr.user1 = :user1 and cdr.user2 = :user2) or (cdr.user1 = :user2 and cdr.user2 = :user1)")
    Optional<ChatDmRoom> findDmUsers(@Param("user1") User user1,
                                     @Param("user2") User user2);

    @Query("select cdr from ChatDmRoom cdr where (cdr.user1.userId = :senderId and cdr.user2.userId = :receiverId) or (cdr.user1.userId = :receiverId and cdr.user2.userId = :senderId)")
    Optional<ChatDmRoom> findDmUserIds(Long senderId, Long receiverId);

    @Transactional
    @Modifying
    @Query("UPDATE ChatDmRoom c SET c.user1 = NULL WHERE c.chatDmRoomId = :roomId")
    void removeUser1FromChatRoom(@Param("roomId") Long roomId);

    @Transactional
    @Modifying
    @Query("UPDATE ChatDmRoom c SET c.user2 = NULL WHERE c.chatDmRoomId = :roomId")
    void removeUser2FromChatRoom(@Param("roomId") Long roomId);

    @Modifying
    @Query("select cdr from ChatDmRoom cdr where cdr.user1.userId = :userId or cdr.user2.userId = :userId")
    Optional<List<ChatDmRoom>> findChatDmRoomById(@Param("userId") Long userId);
}