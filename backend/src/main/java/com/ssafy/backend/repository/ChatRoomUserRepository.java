package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatRoomUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> {
    Optional<ChatRoomUser> findByUser_UserIdAndChatRoom_ChatRoomId(Long userId, Long chatRoomId);
}
