package com.ssafy.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class ChatDmRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatDmRoomId;

    @Lob
    @Column(nullable = false)
    private String chatDmRoomName;

    @OneToOne
    @JoinColumn(name="user1_id")
    @JsonIgnore
    private User user1;

    @OneToOne
    @JoinColumn(name="user2_id")
    @JsonIgnore
    private User user2;

    @Builder
    public ChatDmRoom(User user1, User user2) {
        this.chatDmRoomName = user1.getName() + "&" + user2.getName();
        this.user1 = user1;
        this.user2 = user2;
    }
}
