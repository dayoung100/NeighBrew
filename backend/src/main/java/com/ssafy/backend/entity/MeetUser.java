package com.ssafy.backend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.backend.Enum.MeetType;
import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.dto.MeetUserDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class MeetUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long meetUserId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "meetId")
    private Meet meet;

    // 승인, 대기, 거절, 모임 완료
    @Enumerated(EnumType.STRING)
    private Status status;

    // 유저가 생성, 참여, 신처
    @Enumerated(EnumType.STRING)
    private MeetType meetType;

    public MeetUserDto toDto(){
        return MeetUserDto.builder()
                .meetUserId(this.meetUserId)
                .meet(this.meet)
                .meetType(this.meetType)
                .status(this.status)
                .build();
    }
}

