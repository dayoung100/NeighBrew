package com.ssafy.backend.controller;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.Follow;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.entity.User;
import com.ssafy.backend.repository.DrinkRepository;
import com.ssafy.backend.repository.FollowRepository;
import com.ssafy.backend.repository.MeetUserRepository;
import com.ssafy.backend.repository.UserRepository;
import com.ssafy.backend.service.PushService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.Access;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/mypage")
public class MyPageController {

    private static final Logger logger = LoggerFactory.getLogger(MyPageController.class);
    private UserRepository userRepository;
    private FollowRepository followRepository;
    private DrinkRepository drinkRepository;
    private MeetUserRepository meetUserRepository;

    @Autowired
    public MyPageController(UserRepository userRepository,
                            FollowRepository followRepository,
                            DrinkRepository drinkRepository,
                            MeetUserRepository meetUserRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
        this.drinkRepository = drinkRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> showMyPage(@PathVariable Long userId){
        //마이 페이지 전달 정보-간수치
        // 팔로우 팔로잉 정보
        // 술장
        // 내 모임 출력
        // 알림 리스트 -> 로그인 할 때

        logger.debug("마이페이지 접근 유저 : {}", userId);
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Invalid userId: " + userId));
        List<Drink> myDrinkList = drinkRepository.findMyDrinkByUserId(userId).orElseThrow(()-> new IllegalArgumentException("Invalid userId: " + userId));
        List<Follow> myFollowerList = followRepository.findFollowerByUserId(userId).orElseThrow(()-> new IllegalArgumentException("Invalid userId: " + userId));
        List<Follow> myFollowingList = followRepository.findFollowingByUserId(userId).orElseThrow(()-> new IllegalArgumentException("Invalid userId: " + userId));

        //내가 참여한 모임
        List<MeetUser> myAttendMeet = meetUserRepository.findAttendByUserId(userId).orElseThrow(()-> new IllegalArgumentException("Invalid userId: " + userId));
        //내가 개최한 모임
        List<MeetUser> myHeldMeet = meetUserRepository.findHeldByUserId(userId).orElseThrow(()-> new IllegalArgumentException("Invalid userId: " + userId));



        return null;
    }

}

