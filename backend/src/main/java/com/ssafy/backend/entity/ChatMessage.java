package com.ssafy.backend.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatMessageId;

    @ManyToOne
    @JoinColumn(name = "chatRoomId")
    private ChatRoom chatRoom;

    private Long userId;

    @Lob
    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    @Setter
    private LocalDateTime timestamp;

    @Builder
    public ChatMessage(ChatRoom chatRoom, String message, Long userId, LocalDateTime timestamp) {
        this.chatRoom = chatRoom;
        this.message = message;
        this.userId = userId;
        this.timestamp = timestamp;
    }
}
