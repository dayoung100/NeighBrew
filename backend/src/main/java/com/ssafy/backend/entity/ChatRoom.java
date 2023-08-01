package com.ssafy.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatRoomId;

    @Column(nullable = false, length = 100)
    private String chatRoomName;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<ChatMessage> messages;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<ChatRoomUser> users;

    @Builder
    public ChatRoom(String chatRoomName) {
        this.chatRoomName = chatRoomName;
    }
}
