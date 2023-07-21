package com.ssafy.backend.service;


import com.ssafy.backend.controller.MeetController;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.repository.MeetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MeetService {

    private MeetRepository meetRepository;
    private static final Logger logger = LoggerFactory.getLogger(MeetService.class);

    @Autowired
    public MeetService(MeetRepository meetRepository) {
        this.meetRepository = meetRepository;
    }

    public List<Meet> findAll() {
        logger.info("모든 모임 상세정보 출력 ");
        return meetRepository.findAll();
    }

    public Meet findById(Long meetId) {
        logger.info("meetId : {}인 모임 정보 출력 ", meetId);
        return meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("미팅 정보가 올바르지 않습니다."));
    }

    public Meet saveMeet(Meet meet) {
        logger.info("모임 생성 : {} ", meet);
        meet.setCreatedAt(LocalDateTime.now());
        meet.setUpdatedAt(LocalDateTime.now());

        if (meet.getMeetName().trim().equals("")) throw new IllegalArgumentException("모임 이름 정보가 누락되었습니다.");

        return meetRepository.save(meet);
    }

    public Meet updateMeet(Long meetId, Meet meet) {
        logger.info("meetId : {}인 모임 정보 업데이트 : {} ", meetId, meet);
        Meet findMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("해당 미팅 정보를 찾을 수 없습니다."));

        logger.info("업데이트할 meet : {} ", findMeet);
        findMeet.update(meet);
        logger.info("업데이트 후 meet : {} ", findMeet);
        logger.info("\n >>>>> 현재시간 : {} ", LocalDateTime.now());


        return meetRepository.save(findMeet);
    }

    public void deleteMeet(Long meetId) {
        logger.info("meetId : {}인 모임 삭제", meetId);
        meetRepository.deleteByMeetId(meetId).orElseThrow(() -> new IllegalArgumentException("해당 모임 정보를 찾을 수 없습니다."));
    }


}
