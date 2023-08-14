package com.ssafy.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.backend.Enum.MeetStatus;
import com.ssafy.backend.dto.meet.MeetDto;
import com.ssafy.backend.dto.meet.MeetSearchDto;
import com.ssafy.backend.dto.user.UserResponseDto;
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

    @ManyToOne
    @JoinColumn(name = "hostId", referencedColumnName = "userId")
    private User host;

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
    private Integer sidoCode;
    @Column(nullable = false)
    private Integer gugunCode;

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

    // 채팅과 모임 간의 양방향 일대일 연관관계 - 연관관계 주인은 chatRoom
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    @Enumerated(EnumType.STRING)
    @JsonIgnore
    private MeetStatus meetStatus;

    @Builder
    public Meet(Long meetId, String meetName, String description, User host,
                Integer nowParticipants, Integer maxParticipants,
                LocalDateTime meetDate, Tag tag, Integer sidoCode, Integer gugunCode, Integer minAge, Integer maxAge, Float minLiverPoint,
                Drink drink, String imgSrc) {
        this.meetId = meetId;
        this.meetName = meetName;
        this.description = description;
        this.host = host;
        this.nowParticipants = nowParticipants;
        this.maxParticipants = maxParticipants;
        this.meetDate = meetDate;
        this.tag = tag;
        this.sidoCode = sidoCode;
        this.gugunCode = gugunCode;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.minLiverPoint = minLiverPoint;
        this.drink = drink;
        this.imgSrc = imgSrc;
    }

    public void update(Meet meet) {
        this.meetName = meet.getMeetName();
        this.description = meet.getDescription();
        this.maxParticipants = meet.getMaxParticipants();
        this.meetDate = meet.getMeetDate();
        this.tag = meet.getTag();
        this.sidoCode = meet.getSidoCode();
        this.gugunCode = meet.getGugunCode();
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
                .hostId(this.host.getUserId())
                .nowParticipants(nowParticipants)
                .maxParticipants(maxParticipants)
                .meetDate(this.meetDate)
                .tagId(this.tag.getTagId())
                .sidoCode(this.sidoCode)
                .gugunCode(this.gugunCode)
                .minAge(this.minAge)
                .maxAge(this.maxAge)
                .minLiverPoint(this.minLiverPoint)
                .drink(this.drink)
                .imgSrc(this.imgSrc)
                .chatRoomId(this.chatRoom.getChatRoomId())
                .build();
    }

    public MeetSearchDto toSearchDto(Sido sido, Gugun gugun) {
        return MeetSearchDto.builder()
                .meetId(this.meetId)
                .meetName(this.meetName)
                .description(this.description)
                .host(UserResponseDto.fromEntity(this.host))
                .nowParticipants(nowParticipants)
                .maxParticipants(maxParticipants)
                .meetDate(this.meetDate)
                .tagId(this.tag.getTagId())
                .sido(sido)
                .gugun(gugun)
                .minAge(this.minAge)
                .maxAge(this.maxAge)
                .minLiverPoint(this.minLiverPoint)
                .drink(this.drink)
                .imgSrc(this.imgSrc)
                .chatRoomId(this.chatRoom.getChatRoomId())
                .build();
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
