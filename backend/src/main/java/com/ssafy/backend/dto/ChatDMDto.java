package com.ssafy.backend.dto;

import com.ssafy.backend.entity.ChatDMMessage;
import com.ssafy.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatDMDto {
    private Long senderId;
    private Long receiverId;
    private String message;
    private LocalDateTime createdAt;

    public ChatDMMessage toEntity(User sender, User receiver) {
        return ChatDMMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
