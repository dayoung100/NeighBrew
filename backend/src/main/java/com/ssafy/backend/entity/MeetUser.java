package com.ssafy.backend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.backend.Enum.MeetType;
import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.dto.MeetUserDto;
import lombok.Builder;
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
                .meet(this.meet)
                .build();
    }

    public MeetUser() {
    }

    @Builder
    public MeetUser( User user, Meet meet, Status status, MeetType meetType) {
        this.user = user;
        this.meet = meet;
        this.status = status;
        this.meetType = meetType;
    }
}

