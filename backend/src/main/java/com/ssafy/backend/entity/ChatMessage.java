package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class ChatMessage {
    @Id
    @GeneratedValue
    private Long chatMessageId;

    @ManyToOne
    @JoinColumn(name = "chatRoomId")
    private ChatRoom chatRoom;

    @Column(nullable = false, length = 20)
    private String sender;

    @Lob
    @Column(nullable = false)
    private String message;
}
