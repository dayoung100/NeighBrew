package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Meet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetRepository extends JpaRepository<Meet, Long> {
    @Query("select m.imgSrc from Meet m where m.meetId = :meetId")
    String findImgSrcByMeetId(@Param("meetId") Long meetId);

    // createAt으로 정렬
    Page<Meet> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
