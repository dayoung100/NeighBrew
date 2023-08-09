package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatDmMessage;
import org.aspectj.apache.bcel.classfile.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatDmMessageRepository extends JpaRepository<ChatDmMessage, Long> {
    Optional<List<ChatDmMessage>> findByChatDmRoom_ChatDmRoomId(Long chatDmRoomId);

    void deleteByChatDmRoom_ChatDmRoomId(Long dmRoomId);

    List<ChatDmMessage> findByChatDmRoom_ChatDmRoomIdAndCreatedAtAfter(Long chatDmRoomId, LocalDateTime attendTime);
}
