package com.ssafy.backend.dto;

import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.Tag;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class MeetDto {
    private Long meetId;
    private String meetName;
    private String description;
    private Long hostId;
    private LocalDateTime meetDate;
    private Tag tag;
    private String sido;
    private String gugun;
    private String dong;
    private Integer minAge;
    private Integer maxAge;
    private Float minLiverPoint;
    private List<UserDto> attendUser;

    public Meet toEntity(){
        Meet meet = Meet.builder()
                .meetName(this.meetName)
                .description(this.description)
                .hostId(this.hostId)
                .meetDate(this.meetDate)
                .tag(this.tag)
                .sido(this.sido)
                .gugun(this.gugun)
                .participants(1)
                .dong(this.dong)
                .minAge(this.minAge)
                .maxAge(this.maxAge)
                .minLiverPoint(this.minLiverPoint)
                .build();

        return meet;
    }

    @Override
    public String toString() {
        return "MeetDto{" +
                "meetName='" + meetName + '\'' +
                ", description='" + description + '\'' +
                ", hostId=" + hostId +
                ", meetDate=" + meetDate +
                ", tag=" + tag +
                ", sido='" + sido + '\'' +
                ", gugun='" + gugun + '\'' +
                ", dong='" + dong + '\'' +
                ", minAge=" + minAge +
                ", maxAge=" + maxAge +
                ", minLiverPoint=" + minLiverPoint +
                '}';
    }

    @Builder

    public MeetDto(Long meetId, String meetName, String description, Long hostId, LocalDateTime meetDate, Tag tag, String sido, String gugun, String dong, Integer minAge, Integer maxAge, Float minLiverPoint) {
        this.meetId = meetId;
        this.meetName = meetName;
        this.description = description;
        this.hostId = hostId;
        this.meetDate = meetDate;
        this.tag = tag;
        this.sido = sido;
        this.gugun = gugun;
        this.dong = dong;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.minLiverPoint = minLiverPoint;
    }
}
