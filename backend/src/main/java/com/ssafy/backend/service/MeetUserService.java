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
    private final MeetRepository meetRepository;
    private final UserRepository userRepository;

    @Autowired
    public MeetUserService(MeetUserRepository meetUserRepository,
                           MeetRepository meetRepository,
                           UserRepository userRepository) {
        this.meetUserRepository = meetUserRepository;
        this.meetRepository = meetRepository;
        this.userRepository = userRepository;
    }

    public List<MeetUser> findAll(){
        return meetUserRepository.findAll();
    }


    public Map<String, List<MeetUserDto>> getAllMeetstById(Long userId) {
        Map<String, List<MeetUserDto>> userMeets = new HashMap<>();

        //Long 형태의 userId로는 찾을 수 없다 -> meetUser엔티티는 User를 가지고 있으므로


        userMeets.put("attend", meetUserRepository.findByUser_UserIdAndMeetType(userId, MeetType.ATTEND)
                        .orElse(List.of()).stream().map(MeetUser::toDto).collect(Collectors.toList()));
        userMeets.put("created", meetUserRepository.findByUser_UserIdAndMeetType(userId, MeetType.CREATE)
                .orElse(List.of()).stream().map(MeetUser::toDto).collect(Collectors.toList()));
        userMeets.put("apply", meetUserRepository.findByUser_UserIdAndMeetType(userId, MeetType.APPLY)
                .orElse(List.of()).stream().map(MeetUser::toDto).collect(Collectors.toList()));

        return userMeets;
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
}
