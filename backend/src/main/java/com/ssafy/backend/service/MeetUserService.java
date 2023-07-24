package com.ssafy.backend.service;


import com.ssafy.backend.Enum.MeetType;
import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.dto.MeetUserDto;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.MeetRepository;
import com.ssafy.backend.repository.MeetUserRepository;
import com.ssafy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

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

    public void saveMeetUser(Meet newMeet, User host){
        meetUserRepository.save(
                MeetUser.builder()
                        .user(host)
                        .meet(newMeet)
                        .meetType(MeetType.CREATE)
                        .status(Status.ACCEPTED)
                        .build());
    }

    @Transactional
    public void deleteMeetUser(Meet deleteMeet, User host){
        meetUserRepository.deleteByMeet_MeetIdAndUser_UserId(deleteMeet.getMeetId(), host.getUserId());
    }

    public void updateMeetStatus(Long userId, Long meetId) {
        meetUserRepository.findByUser_UserIdAndMeet_MeetId(userId, meetId).orElseThrow(() -> new IllegalArgumentException("유저 정보 및 미팅 정보가 올바르지 않습니다."));
    }
}
