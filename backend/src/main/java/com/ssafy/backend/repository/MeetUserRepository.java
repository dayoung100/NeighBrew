package com.ssafy.backend.repository;

import com.ssafy.backend.entity.MeetUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeetUserRepository extends JpaRepository<MeetUser, Long> {
    Optional<List<MeetUser>> findByUser_UserIdOrderByStatus(Long userId);
    @Transactional
    void deleteByMeet_MeetId(Long meetId);
    Optional<List<MeetUser>> findByMeet_MeetIdOrderByStatusDesc(Long meetId);

    Optional<MeetUser> findByUser_UserIdAndMeet_MeetId(Long userId, Long meetId);
}

