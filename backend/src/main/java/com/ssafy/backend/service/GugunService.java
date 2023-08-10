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

    public Gugun getGugun(Integer sidoCode, Integer gugunCode) {
        return gugunRepository.findBySidoCodeAndGugunCode(sidoCode, gugunCode).orElseThrow(()-> new IllegalArgumentException("시도, 구군 데이터가 올바르지 않습니다."));
    }
}
