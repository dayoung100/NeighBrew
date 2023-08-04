package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatDmMessage;
import org.aspectj.apache.bcel.classfile.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatDmMessageRepository extends JpaRepository<ChatDmMessage, Long> {
    Optional<List<ChatDmMessage>> findByChatDmRoom_ChatDmRoomId(Long dmRoomId);

    void deleteByChatDmRoom_ChatDmRoomId(Long dmRoomId);
}
