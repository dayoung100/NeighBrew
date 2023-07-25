package com.ssafy.backend.service;


import com.ssafy.backend.Enum.MeetType;
import com.ssafy.backend.controller.MeetController;
import com.ssafy.backend.dto.MeetDto;
import com.ssafy.backend.dto.MeetUserDto;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.repository.MeetRepository;
import com.ssafy.backend.repository.MeetUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MeetService {

    private MeetRepository meetRepository;
    private MeetUserRepository meetUserRepository;
    private static final Logger logger = LoggerFactory.getLogger(MeetService.class);

    @Autowired
    public MeetService(MeetRepository meetRepository,
                       MeetUserRepository meetUserRepository) {
        this.meetRepository = meetRepository;
        this.meetUserRepository = meetUserRepository;
    }

    public List<Meet> findAll() {
        logger.info("모든 모임 상세정보 출력 ");
        return meetRepository.findAll();
    }

    public MeetUserDto findMeetUserByMeetId(Long meetId) {
        logger.info("meetId : {}인 모임 정보 출력 ", meetId);

        List<MeetUser> meetUsers = meetUserRepository.findByMeet_MeetId(meetId).orElseThrow(()-> new IllegalArgumentException("모임 ID 값이 올바르지 않습니다."));

        MeetUserDto meetUserDto = MeetUserDto.builder()
                .meetUserId(meetUsers.get(0).getMeetUserId())
                .meet(meetUsers.get(0).getMeet())
                .build();

        for(MeetUser mu : meetUsers){
            meetUserDto.getUsers().add(mu.getUser());
            meetUserDto.getMeetTypes().add(mu.getMeetType());
            meetUserDto.getStatuses().add(mu.getStatus());
        }
        return meetUserDto;
    }

    public Meet findByMeetId(Long meetId) {
        return meetRepository.findById(meetId).orElseThrow(()->new IllegalArgumentException("미팅 정보가 올바르지 않습니다."));
    }

    public Map<String, List<Meet>> findByUserId(Long userId) {
        Map<String, List<Meet>> userMeets = new HashMap<>();
        userMeets.put(MeetType.APPLY.name(), new ArrayList<>());
        userMeets.put(MeetType.ATTEND.name(), new ArrayList<>());
        userMeets.put(MeetType.CREATE.name(), new ArrayList<>());

        List<MeetUser> meetUsers = meetUserRepository.findByUser_UserIdOrderByMeetType(userId).orElseThrow(()-> new IllegalArgumentException("유저ID 값이 올바르지 않습니다."));

        for(MeetUser mu : meetUsers){
            if(mu.getMeetType() == MeetType.ATTEND)
                userMeets.get(MeetType.ATTEND.name()).add(mu.getMeet());
            else if(mu.getMeetType() == MeetType.APPLY)
                userMeets.get(MeetType.APPLY.name()).add(mu.getMeet());
            else userMeets.get(MeetType.CREATE.name()).add(mu.getMeet());
        }

        return userMeets;
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
        Meet meet = meetRepository.findById(meetId).orElse(null);
        if(meet != null){
            meetRepository.delete(meet);
        }
    }
}
