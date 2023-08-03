package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatDM;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatDMRepository extends JpaRepository<ChatDM, Long> {
    ChatDM findByUser1_UserIdAndUser2_UserId(Long user1Id, Long user2Id);
}
