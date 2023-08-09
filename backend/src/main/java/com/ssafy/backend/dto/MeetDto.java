package com.ssafy.backend.dto;

import com.ssafy.backend.entity.Drink;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.Tag;
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
    private String sido;
    private String gugun;
    private Integer minAge;
    private Integer maxAge;
    private Float minLiverPoint;
    private Drink drink;
    private String imgSrc;
    private Long chatRoomId;

    public MeetDto() {}

    @Builder
    public MeetDto(Long meetId, String meetName, String description, Long hostId, Integer nowParticipants, Integer maxParticipants, LocalDateTime meetDate, Long tagId, String sido, String gugun,Integer minAge, Integer maxAge, Float minLiverPoint, Drink drink, String imgSrc, Long chatRoomId) {
        this.meetId = meetId;
        this.meetName = meetName;
        this.description = description;
        this.hostId = hostId;
        this.nowParticipants = nowParticipants;
        this.maxParticipants = maxParticipants;
        this.meetDate = meetDate;
        this.tagId = tagId;
        this.sido = sido;
        this.gugun = gugun;
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
                .sido(this.sido)
                .gugun(this.gugun)
                .minAge(this.minAge)
                .maxAge(this.maxAge)
                .minLiverPoint(this.minLiverPoint)
                .drink(this.drink)
                .imgSrc(this.imgSrc)
                .build();
    }
}
