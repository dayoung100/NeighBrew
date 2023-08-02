package com.ssafy.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JsonManagedReference
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @Lob
    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    @Setter
    private LocalDateTime timestamp;

    @Builder
    public ChatMessage(ChatRoom chatRoom, String message, User user, LocalDateTime timestamp) {
        this.chatRoom = chatRoom;
        this.message = message;
        this.timestamp = timestamp;
        this.user = user;
    }
}
