package com.ssafy.backend.dto;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.Tag;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
public class MeetDto {
    private Long meetId;
    private String meetName;
    private String description;
    private Long hostId;
    private Integer nowParticipants;
    private Integer maxParticipants;
    private LocalDateTime meetDate;
    private Tag tag;
    private String sido;
    private String gugun;
    private String dong;
    private Integer minAge;
    private Integer maxAge;
    private Float minLiverPoint;
    private List<UserDto> attendUser;
    private Drink drink;
    private String imgSrc;

    public Meet toEntity(){
        return Meet.builder()
                .meetName(this.meetName)
                .description(this.description)
                .hostId(this.hostId)
                .nowParticipants(this.nowParticipants)
                .maxParticipants(this.maxParticipants)
                .meetDate(this.meetDate)
                .tag(this.tag)
                .sido(this.sido)
                .gugun(this.gugun)
                .dong(this.dong)
                .minAge(this.minAge)
                .maxAge(this.maxAge)
                .minLiverPoint(this.minLiverPoint)
                .build();
    }

    public MeetDto() {}

    @Builder
    public MeetDto(Long meetId, String meetName, String description, Long hostId, Integer nowParticipants, Integer maxParticipants, LocalDateTime meetDate, Tag tag, String sido, String gugun, String dong, Integer minAge, Integer maxAge, Float minLiverPoint, List<UserDto> attendUser, Drink drink, String imgSrc) {
        this.meetId = meetId;
        this.meetName = meetName;
        this.description = description;
        this.hostId = hostId;
        this.nowParticipants = nowParticipants;
        this.maxParticipants = maxParticipants;
        this.meetDate = meetDate;
        this.tag = tag;
        this.sido = sido;
        this.gugun = gugun;
        this.dong = dong;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.minLiverPoint = minLiverPoint;
        this.attendUser = attendUser;
        this.drink = drink;
        this.imgSrc = imgSrc;
    }
}
