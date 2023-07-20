package com.ssafy.backend.service;

import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.repository.MeetRepository;
import com.ssafy.backend.repository.MeetUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MeetService {
    private MeetRepository meetRepository;

    @Autowired
    private MeetService(MeetRepository meetRepository){
        this.meetRepository = meetRepository;
    }
    public List<Meet> findAll() {return meetRepository.findAll(); }

    public List<Meet> findByDrinkCategory(String drinkType) {
        return meetRepository.findByDrinkCategory(drinkType);
    }

    public Object findByMeetId(Long meetId) {
        return meetRepository.findByMeetId(meetId);
    }
}
