package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatRoom;
import com.ssafy.backend.entity.ChatRoomUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> {
    Optional<ChatRoomUser> findByUser_UserIdAndChatRoom_ChatRoomId(Long userId, Long chatRoomId);

    Optional<ChatRoomUser> findByChatRoomAndUser_UserId(ChatRoom chatRoom, long userId);

    List<ChatRoomUser> findByUser_UserId(Long userId);
}
