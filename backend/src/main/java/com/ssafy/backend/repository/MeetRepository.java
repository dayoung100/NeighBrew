package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Meet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetRepository extends JpaRepository<Meet, Long> {
    @Query("select m.imgSrc from Meet m where m.meetId = :meetId")
    String findImgSrcByMeetId(@Param("meetId") Long meetId);

//    meetDto가 hostId만 가지고 있을 때
//    @Query("SELECT new com.ssafy.backend.dto.MeetDto(m.meetId, m.meetName, m.description, m.hostId, m.nowParticipants, m.maxParticipants, m.meetDate, m.tag.tagId, m.sido, m.gugun, m.dong, m.minAge, m.maxAge, m.minLiverPoint, m.drink, m.imgSrc, m.chatRoom.chatRoomId) " +
//            "FROM Meet m " +
//            "ORDER BY m.createdAt DESC")
//    Page<MeetDto> findAllByOrderByCreatedAtDesc(Pageable pageable);
//
//
//    @Query("SELECT new com.ssafy.backend.dto.MeetDto(m.meetId, m.meetName, m.description, m.hostId, m.nowParticipants, m.maxParticipants, m.meetDate, m.tag.tagId, m.sido, m.gugun, m.dong, m.minAge, m.maxAge, m.minLiverPoint, m.drink, m.imgSrc, m.chatRoom.chatRoomId) " +
//            "FROM Meet m " +
//            "Where m.tag.tagId = :tagId " +
//            "ORDER BY m.createdAt DESC")
//    Page<MeetDto> findAllMeetDtosOrderByCreatedAtDesc(@Param("tagId") Long tagId,
//                                                      Pageable pageable);

    Page<Meet> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Meet> findByTag_TagIdOrderByCreatedAtDesc(@Param("tagId") Long tagId,
                                                   Pageable pageable);

    // 현재시간보다 모임시간이 빠른경우
    @Query("SELECT m FROM Meet m WHERE m.meetDate < CURRENT_TIMESTAMP")
    List<Meet> findMeetByMeetDateBefore();
}

