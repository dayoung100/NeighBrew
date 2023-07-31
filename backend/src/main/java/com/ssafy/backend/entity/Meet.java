package com.ssafy.backend.entity;

import com.ssafy.backend.dto.MeetDto;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class Meet {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @GeneratedValue
    private Long meetId;

    @Column(nullable = false, length = 100)
    private String meetName;

    @Lob
    private String description;

    @Column(nullable = false)
    private Long hostId;

    //현재 참여 인원
    @Column(nullable = false, columnDefinition = "int default 1")
    private Integer nowParticipants;

    //최대 참여 인원
    @Column(nullable = false, columnDefinition = "int default 8")
    private Integer maxParticipants;

    //모임날짜
    private LocalDateTime meetDate;

    @ManyToOne
    @JoinColumn(name = "tagId")
    private Tag tag;


    @Column(nullable = false)
    private String sido;
    @Column(nullable = false)
    private String gugun;
    @Column(nullable = false)
    private String dong;

    private Integer minAge;
    private Integer maxAge;
    private Float minLiverPoint;

    //술ID
    @OneToOne
    @JoinColumn(name = "drinkId")
    private Drink drink;

    //미팅 이미지 url
    @Lob
    private String imgSrc;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;


    @Builder
    public Meet(String meetName, String description, Long hostId,
                Integer nowParticipants, Integer maxParticipants,
                LocalDateTime meetDate, Tag tag, String sido, String gugun,
                String dong, Integer minAge, Integer maxAge, Float minLiverPoint,
                Drink drink, String imgSrc) {
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
        this.drink = drink;
        this.imgSrc = imgSrc;
    }

    public void update(Meet meet) {
        this.meetName = meet.getMeetName();
        this.description = meet.getDescription();
        this.nowParticipants = meet.getNowParticipants();
        this.maxParticipants = meet.getMaxParticipants();
        this.hostId = meet.getHostId();
        this.meetDate = meet.getMeetDate();
        this.tag = meet.getTag();
        this.sido = meet.getSido();
        this.gugun = meet.getGugun();
        this.dong = meet.getDong();
        this.minAge = meet.getMinAge();
        this.maxAge = meet.getMaxAge();
        this.minLiverPoint = meet.getMinLiverPoint();
        this.updatedAt = LocalDateTime.now();
        this.drink = meet.getDrink();
        this.imgSrc = meet.getImgSrc();
    }

    public MeetDto toDto() {
        return MeetDto.builder()
                .meetId(this.meetId)
                .meetName(this.meetName)
                .description(this.description)
                .hostId(this.hostId)
                .nowParticipants(nowParticipants)
                .maxParticipants(maxParticipants)
                .meetDate(this.meetDate)
                .tagId(this.tag.getTagId())
                .sido(this.sido)
                .gugun(this.gugun)
                .dong(this.dong)
                .minAge(this.minAge)
                .maxAge(this.maxAge)
                .minLiverPoint(this.minLiverPoint)
                .drink(this.drink)
                .imgSrc(this.imgSrc)
                .build();
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
