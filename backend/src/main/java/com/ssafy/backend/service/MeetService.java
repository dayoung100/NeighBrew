package com.ssafy.backend.service;


import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.dto.MeetDto;
import com.ssafy.backend.dto.MeetUserDto;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.entity.Tag;
import com.ssafy.backend.repository.DrinkRepository;
import com.ssafy.backend.repository.MeetRepository;
import com.ssafy.backend.repository.MeetUserRepository;
import com.ssafy.backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class MeetService {

    private final MeetRepository meetRepository;
    private final MeetUserRepository meetUserRepository;
    private final TagRepository tagRepository;
    private final DrinkRepository drinkRepository;

    public List<MeetDto> findAll() {
        List<Meet> list = meetRepository.findAll();

        List<MeetDto> dtos = new ArrayList<>();
        for(Meet meet : list){
            dtos.add(MeetDto.builder()
                    .meetId(meet.getMeetId())
                    .meetName(meet.getMeetName())
                    .description(meet.getDescription())
                    .hostId(meet.getHostId())
                    .nowParticipants(meet.getNowParticipants())
                    .maxParticipants(meet.getMaxParticipants())
                    .meetDate(meet.getMeetDate())
                    .tagId(meet.getTag().getTagId())
                    .sido(meet.getSido())
                    .gugun(meet.getGugun())
                    .dong(meet.getDong())
                    .minAge(meet.getMinAge())
                    .maxAge(meet.getMaxAge())
                    .minLiverPoint(meet.getMinLiverPoint())
                    .drink(meet.getDrink())
                    .imgSrc(meet.getImgSrc())
                    .build());
        }
        return dtos;
    }

    public MeetUserDto findMeetUserByMeetId(Long meetId) {
        log.info("meetId : {}인 모임 정보 출력 ", meetId);

        List<MeetUser> meetUsers = meetUserRepository.findByMeet_MeetIdOrderByStatusDesc(meetId).orElseThrow(()-> new IllegalArgumentException("모임 ID 값이 올바르지 않습니다."));

        MeetUserDto meetUserDto = MeetUserDto.builder()
                .meetDto(meetUsers.get(0).getMeet().toDto())
                .build();
        for(MeetUser mu : meetUsers){
            meetUserDto.getUsers().add(mu.getUser());
            meetUserDto.getStatuses().add(mu.getStatus());
        }
        return meetUserDto;
    }

    public Meet findByMeetId(Long meetId) {
        return meetRepository.findById(meetId).orElseThrow(()->new IllegalArgumentException("미팅 정보가 올바르지 않습니다."));
    }

    public Map<String, List<MeetDto>> findByUserId(Long userId) {
        Map<String, List<MeetDto>> userMeets = new HashMap<>();
        userMeets.put(Status.APPLY.name(), new ArrayList<>());
        userMeets.put(Status.GUEST.name(), new ArrayList<>());
        userMeets.put(Status.HOST.name(), new ArrayList<>());

        List<MeetUser> meetUsers = meetUserRepository.findByUser_UserIdOrderByStatus(userId).orElseThrow(()-> new IllegalArgumentException("유저ID 값이 올바르지 않습니다."));

        for(MeetUser mu : meetUsers){
            Status status = mu.getStatus();

            if(status != Status.FINISH)
                userMeets.get(status.name()).add(mu.getMeet().toDto());
        }

        return userMeets;
    }

    public Meet saveMeet(MeetDto meetDto, Long drinkId) {
        log.info("모임 생성 : {} ", meetDto);
        meetDto.setNowParticipants(1); //참여자는 방장 1명 뿐이기 때문

        log.info("태그 Id 출력{}", meetDto.getTagId());
        Meet meet = meetDto.toEntity();

        meet.setDrink(drinkRepository.findByDrinkId(drinkId).orElseThrow(()-> new IllegalArgumentException("주종 정보가 올바르지 않습니다.")));
        meet.setTag(tagRepository.findByTagId(meetDto.getTagId()).orElseThrow(()-> new IllegalArgumentException("태그 정보가 올바르지 않습니다.")));
        meet.setCreatedAt(LocalDateTime.now());
        meet.setUpdatedAt(LocalDateTime.now());

        log.info("얼라리 문제 생기나 : {} ", meet);

        return meetRepository.save(meet);
    }

    public Meet updateMeet(Long meetId, MeetDto meetDto) {
        log.info("meetId : {}인 모임 정보 업데이트 : {} ", meetId, meetDto);

        Meet meet = meetDto.toEntity();

        Meet findMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("해당 미팅 정보를 찾을 수 없습니다."));

        log.info("업데이트할 meet : {} ", findMeet);
        findMeet.update(meet);
        log.info("업데이트 후 meet : {} ", findMeet);
        log.info("\n >>>>> 현재시간 : {} ", LocalDateTime.now());

        return meetRepository.save(findMeet);
    }

    public Meet updateMeet(Long meetId, Meet meet) {
        log.info("meetId : {}인 모임 정보 업데이트 : {} ", meetId, meet);
        Meet findMeet = meetRepository.findById(meetId).orElseThrow(() -> new IllegalArgumentException("해당 미팅 정보를 찾을 수 없습니다."));

        log.info("업데이트할 meet : {} ", findMeet);
        findMeet.update(meet);
        log.info("업데이트 후 meet : {} ", findMeet);
        log.info("\n >>>>> 현재시간 : {} ", LocalDateTime.now());

        return meetRepository.save(findMeet);
    }

    public void deleteMeet(Long meetId) {
        log.info("meetId : {}인 모임 삭제", meetId);
        Meet meet = meetRepository.findById(meetId).orElse(null);
        if(meet != null){
            meetRepository.delete(meet);
        }
    }
}
