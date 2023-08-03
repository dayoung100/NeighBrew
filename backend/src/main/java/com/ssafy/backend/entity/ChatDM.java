package com.ssafy.backend.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "chat_dm")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatDM {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="chat_dm_id")
    private Long chatDMId;

    @ManyToOne
    @JoinColumn(name = "sender_Id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_Id")
    private User receiver;

    @OneToMany(mappedBy = "chatDM", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatDMMessage> chatDMMessages = new ArrayList<>();

    @Builder
    public ChatDM(User sender, User receiver) {
        this.sender = sender;
        this.receiver = receiver;
    }
}
