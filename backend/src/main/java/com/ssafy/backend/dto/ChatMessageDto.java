package com.ssafy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
public class ChatMessageDto {
    private Long chatMessageId;
    private Long chatRoomId;
    private Long userId;
    private String message;
    private LocalDateTime timestamp;
}
