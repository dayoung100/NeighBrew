package com.ssafy.backend.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatDM {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatDMId;

    @ManyToOne
    @JoinColumn(name = "user1Id")
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2Id")
    private User user2;

    @OneToMany(mappedBy = "chatDM", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatDMMessage> chatDMMessages = new ArrayList<>();

    @Builder
    public ChatDM(User user1, User user2) {
        this.user1 = user1;
        this.user2 = user2;
    }
}
