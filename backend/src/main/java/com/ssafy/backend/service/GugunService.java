package com.ssafy.backend.service;

import com.ssafy.backend.entity.Gugun;
import com.ssafy.backend.repository.GugunRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GugunService {
    private final GugunRepository gugunRepository;

    public List<Gugun> getGugunsBySidoCode(Integer sidoCode) {
        return gugunRepository.findBySidoCode(sidoCode);
    }
}
