package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatMessage;
import com.ssafy.backend.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
}
