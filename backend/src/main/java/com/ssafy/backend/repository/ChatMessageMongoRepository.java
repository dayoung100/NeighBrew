package com.ssafy.backend.repository;

import com.ssafy.backend.entity.ChatMessageMongo;

import java.util.List;

public interface ChatMessageMongoRepository extends org.springframework.data.mongodb.repository.MongoRepository<ChatMessageMongo, String> {
    List<ChatMessageMongo> findByChatRoomIdOrderByCreatedAt(Long chatRoomId);


}
