package com.ssafy.backend.dto;

import com.ssafy.backend.entity.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class MeetSearchDto {
    private Long meetId;
    private String meetName;
    private String description;
    private UserDto host;
    private Integer nowParticipants;
    private Integer maxParticipants;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime meetDate;
    private Long tagId;
    private Sido sido;
    private Gugun gugun;
    private Integer minAge;
    private Integer maxAge;
    private Float minLiverPoint;
    private Drink drink;
    private String imgSrc;
    private Long chatRoomId;

    public MeetSearchDto() {}

    @Builder
    public MeetSearchDto(Long meetId, String meetName, String description, UserDto host, Integer nowParticipants, Integer maxParticipants, LocalDateTime meetDate, Long tagId, Sido sido, Gugun gugun, Integer minAge, Integer maxAge, Float minLiverPoint, Drink drink, String imgSrc, Long chatRoomId) {
        this.meetId = meetId;
        this.meetName = meetName;
        this.description = description;
        this.host = host;
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
}
