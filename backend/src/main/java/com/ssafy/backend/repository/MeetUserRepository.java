package com.ssafy.backend.repository;

import com.ssafy.backend.Enum.MeetType;
import com.ssafy.backend.entity.MeetUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeetUserRepository extends JpaRepository<MeetUser, Long> {
    Optional<List<MeetUser>> findByUser_UserIdOrderByMeetType(Long userId);
    @Transactional
    void deleteByMeet_MeetIdAndUser_UserId(Long meetId, Long userId);
    Optional<List<MeetUser>> findByMeet_MeetId(Long meetId);

    Optional<Object> findByUser_UserIdAndMeet_MeetId(Long userId, Long meetId);
}

