package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatDmMessage;
import org.aspectj.apache.bcel.classfile.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatDmMessageRepository extends JpaRepository<ChatDmMessage, Long> {
    @Query("SELECT cdr FROM ChatDmRoom cdr WHERE (cdr.user1.userId = :senderId AND cdr.user2.userId = :receiverId) OR (cdr.user1.userId = :receiverId AND cdr.user2.userId = :senderId)")
    Optional<List<ChatDmMessage>> findByChatDmRoom_ChatDmRoomId(@Param("senderId")Long senderId,
                                                                @Param("senderId")Long receiverId);

    void deleteByChatDmRoom_ChatDmRoomId(Long dmRoomId);
}
