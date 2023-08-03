package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatDM;
import com.ssafy.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatDMRepository extends JpaRepository<ChatDM, Long> {
    @Query("SELECT c FROM ChatDM c WHERE (c.user1 = :user1 AND c.user2 = :user2) OR (c.user1 = :user2 AND c.user2 = :user1)")
    Optional<ChatDM> findChatRoomByUsers(User user1, User user2);
}