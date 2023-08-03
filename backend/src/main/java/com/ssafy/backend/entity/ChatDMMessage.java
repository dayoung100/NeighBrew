package com.ssafy.backend.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity(name = "chat_dm_message")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatDMMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_dm_message_id")
    private Long chatDMMessageId;

    @ManyToOne
    @JoinColumn(name = "chat_dm_Id")
    private ChatDM chatDM;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Lob
    @Column(nullable = false)
    private String message;

    private LocalDateTime createdAt;

    @Builder
    public ChatDMMessage(ChatDM chatDM, User sender, User receiver, String message, LocalDateTime createdAt) {
        this.chatDM = chatDM;
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void createdAt() {
        this.createdAt = LocalDateTime.now();
    }
}
