package com.ssafy.backend.dto;

import com.ssafy.backend.Enum.MeetType;
import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.MeetUser;
import com.ssafy.backend.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
public class MeetUserDto {

    private Long meetUserId;

    private Meet meet;

    // 승인, 대기, 거절, 모임 완료
    private Status status;

    // 유저가 생성, 참여, 신처
    private MeetType meetType;

    @Builder
    public MeetUserDto(Long meetUserId, Meet meet, Status status, MeetType meetType) {
        this.meetUserId = meetUserId;
        this.meet = meet;
        this.status = status;
        this.meetType = meetType;
    }
}
