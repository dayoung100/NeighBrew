package com.ssafy.backend.dto;

import com.ssafy.backend.entity.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
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
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime meetDate;
    private Long tagId;
    private Integer sidoCode;
    private Integer gugunCode;
    private Integer minAge;
    private Integer maxAge;
    private Float minLiverPoint;
    private Drink drink;
    private String imgSrc;
    private Long chatRoomId;

    public MeetDto() {}

    @Builder
    public MeetDto(Long meetId, String meetName, String description, Long hostId, Integer nowParticipants, Integer maxParticipants, LocalDateTime meetDate, Long tagId, Integer sidoCode, Integer gugunCode,Integer minAge, Integer maxAge, Float minLiverPoint, Drink drink, String imgSrc, Long chatRoomId) {
        this.meetId = meetId;
        this.meetName = meetName;
        this.description = description;
        this.hostId = hostId;
        this.nowParticipants = nowParticipants;
        this.maxParticipants = maxParticipants;
        this.meetDate = meetDate;
        this.tagId = tagId;
        this.sidoCode = sidoCode;
        this.gugunCode = gugunCode;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.minLiverPoint = minLiverPoint;
        this.drink = drink;
        this.imgSrc = imgSrc;
        this.chatRoomId = chatRoomId;
    }

    public Meet toEntity(){
        return Meet.builder()
                .meetName(this.meetName)
                .description(this.description)
                .nowParticipants(this.nowParticipants)
                .maxParticipants(this.maxParticipants)
                .meetDate(this.meetDate)
                .sidoCode(this.sidoCode)
                .gugunCode(this.gugunCode)
                .minAge(this.minAge)
                .maxAge(this.maxAge)
                .minLiverPoint(this.minLiverPoint)
                .drink(this.drink)
                .imgSrc(this.imgSrc)
                .build();
    }
}
