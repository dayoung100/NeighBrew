package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatDmRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatDmRoomRepository extends JpaRepository<ChatDmRoom, Long> {
//    @Query("SELECT c FROM ChatDM c WHERE (c.user1 = :user1 AND c.user2 = :user2) OR (c.user1 = :user2 AND c.user2 = :user1)")
//    Optional<ChatDM> findChatRoomByUsers(User user1, User user2);
}