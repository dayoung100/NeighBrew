package com.ssafy.backend.repository;
import com.ssafy.backend.entity.Mongo;

import java.util.List;
public interface MongoRepository extends org.springframework.data.mongodb.repository.MongoRepository<Mongo, String> {
    List<Mongo> findByChatRoomIdOrderByCreatedAt(Long chatRoomId);
}
