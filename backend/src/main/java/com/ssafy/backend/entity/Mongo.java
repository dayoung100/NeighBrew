package com.ssafy.backend.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;

@Document(collection = "chat")
@Getter
@NoArgsConstructor
public class Mongo {
    @Id
    private String id;
    private Long chatRoomId;
    private String chatRoomName;
    private Long userId;
    private String userNickname;
    private String message;
    private String createdAt;

    @Builder
    public Mongo(String id, Long chatRoomId, String chatRoomName, Long userId, String userNickname, String message, String createdAt) {
        this.id = id;
        this.chatRoomId = chatRoomId;
        this.chatRoomName = chatRoomName;
        this.userId = userId;
        this.userNickname = userNickname;
        this.message = message;
        this.createdAt = createdAt;
    }
}
