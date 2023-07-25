package com.ssafy.backend.service;


import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.MeetUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class MeetUserService {

    private final MeetUserRepository meetUserRepository;
    @Autowired
    public MeetUserService(MeetUserRepository meetUserRepository) {
        this.meetUserRepository = meetUserRepository;
    }

    public List<MeetUser> findAll(){
        return meetUserRepository.findAll();
    }

    public void saveMeetUser(Meet newMeet, User host, Status status){
        meetUserRepository.save(
                MeetUser.builder()
                        .user(host)
                        .meet(newMeet)
                        .status(status)
                        .build());
    }

    @Transactional
    public void deleteMeetUser(Meet deleteMeet){
        meetUserRepository.deleteByMeet_MeetId(deleteMeet.getMeetId());
    }

    public void updateMeetStatus(Long userId, Long meetId, Status status) {
        //meetUser 정보를 가져온다.
        MeetUser meetUser = meetUserRepository.findByUser_UserIdAndMeet_MeetId(userId, meetId).orElseThrow(() -> new IllegalArgumentException("유저 정보 및 미팅 정보가 올바르지 않습니다."));




    }
}
