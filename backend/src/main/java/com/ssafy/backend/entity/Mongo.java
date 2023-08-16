package com.ssafy.backend.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;

@Document(collection = "chat")
public class Mongo {
    @Id
    private String id;
    private Long chatRoomId;
    private Long chatRoomName;
    private Long userId;
    private String userNickname;
    private String message;
    private String createdAt;
}
