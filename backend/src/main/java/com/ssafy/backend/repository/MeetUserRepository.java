package com.ssafy.backend.repository;

import com.ssafy.backend.entity.MeetUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MeetUserRepository extends JpaRepository<MeetUser, Long> {

    //유저의 미팅 리스트를 출력한다.
    Optional<List<MeetUser>> findByUserId(Long id, Long masterId);



}
