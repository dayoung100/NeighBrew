package com.ssafy.backend.service;


import com.ssafy.backend.Enum.MeetType;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.repository.MeetUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

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


    public Map<String, List<MeetUser>> getAllMeetstById(Long userId) {
        Map<String, List<MeetUser>> userMeets = new HashMap<>();

        //Long 형태의 userId로는 찾을 수 없다 -> meetUser엔티티는 User를 가지고 있으므로
        //
        userMeets.put("attend", meetUserRepository.findByUser_UserIdAndMeetType(userId, MeetType.CREATE)
                .orElseThrow(()-> new IllegalArgumentException("유저 아이디나 Type선언이 잘못 되었습니다.")));
        userMeets.put("created", meetUserRepository.findByUser_UserIdAndMeetType(userId, MeetType.ATTEND)
                .orElseThrow(()-> new IllegalArgumentException("유저 아이디나 Type선언이 잘못 되었습니다.")));
        userMeets.put("apply", meetUserRepository.findByUser_UserIdAndMeetType(userId, MeetType.APPLY)
                .orElseThrow(()-> new IllegalArgumentException("유저 아이디나 Type선언이 잘못 되었습니다.")));

        return userMeets;
    }
}
