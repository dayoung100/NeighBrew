package com.ssafy.backend.repository;

import com.ssafy.backend.Enum.MeetType;
import com.ssafy.backend.entity.MeetUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeetUserRepository extends JpaRepository<MeetUser, Long> {

    Optional<List<MeetUser>> findByUser_UserIdAndMeetType(Long userId, MeetType meetType);
}
//findByUser_UserIdAndType
