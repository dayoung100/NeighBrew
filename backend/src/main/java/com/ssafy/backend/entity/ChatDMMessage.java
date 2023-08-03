package com.ssafy.backend.entity;

import javax.persistence.*;

@Entity
public class ChatDMMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatDMMessageId;

    @ManyToOne
    @JoinColumn(name = "chatDMId")
    private ChatDM chatDM;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @Lob
    @Column(nullable = false)
    private String message;
}
