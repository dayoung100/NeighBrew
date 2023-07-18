package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class ChatRoomUser {
    @Id
    @GeneratedValue
    private Long chatRoomUserId;

    @ManyToOne
    @JoinColumn(name = "chatRoomId")
    private ChatRoom chatRoom;
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;
}
