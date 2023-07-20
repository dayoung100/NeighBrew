package com.ssafy.backend.service;



import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.repository.MeetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MeetService {

    private MeetRepository meetRepository;

    @Autowired
    public MeetService(MeetRepository meetRepository) {
        this.meetRepository = meetRepository;
    }
    public Object findById(Long meetId) {
        return meetRepository.findById(meetId);
    }
}
