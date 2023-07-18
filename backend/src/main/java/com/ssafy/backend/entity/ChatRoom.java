package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Where(clause = "deleted = false")
public class ChatRoom {
    @Id
    @GeneratedValue
    private Long chatRoomId;

    @Column(nullable = false, length = 100)
    private String chatRoomName;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "chatRoomUser", cascade = CascadeType.ALL)
    private List<ChatRoomUser> chatRoomUsers;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    private List<ChatRoomUser> users;

    private boolean deleted = false;
}
