package com.ssafy.backend.service;

import com.ssafy.backend.entity.Festival;
import com.ssafy.backend.repository.DrinkFestivalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DrinkFestivalService {
    private final DrinkFestivalRepository drinkFestivalRepository;

    public List<Festival> getAllFestival() {
        return drinkFestivalRepository.findAll();
    }
}
