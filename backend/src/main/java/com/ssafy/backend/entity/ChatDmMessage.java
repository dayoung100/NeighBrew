package com.ssafy.backend.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "chat_dm_message")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatDmMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatDmMessageId;

    @ManyToOne
    @JoinColumn(name="chat_dm_room_id")
    private ChatDmRoom chatDmRoom;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User sender;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    @Setter
    private LocalDateTime createdAt;

    @Builder
    public ChatDmMessage(ChatDmRoom chatDmRoom, User sender, String content, LocalDateTime createdAt) {
        this.chatDmRoom = chatDmRoom;
        this.sender = sender;
        this.content = content;
        this.createdAt = createdAt;
    }


    @PrePersist
    public void createdAt() {
        this.createdAt = LocalDateTime.now();
    }
}
