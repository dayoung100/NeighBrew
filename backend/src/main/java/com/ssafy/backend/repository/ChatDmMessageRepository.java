package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatDmMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatDmMessageRepository extends JpaRepository<ChatDmMessage, Long> {
}
