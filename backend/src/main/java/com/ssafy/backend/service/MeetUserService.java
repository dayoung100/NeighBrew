package com.ssafy.backend.service;


import com.ssafy.backend.Enum.MeetType;
import com.ssafy.backend.dto.MeetUserDto;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.repository.MeetUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MeetUserService {

    private MeetUserRepository meetUserRepository;

    @Autowired
    public MeetUserService(MeetUserRepository meetUserRepository) {
        this.meetUserRepository = meetUserRepository;
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
}
