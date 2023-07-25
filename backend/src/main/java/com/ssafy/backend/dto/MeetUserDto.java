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
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MeetUserDto {

    private Long meetUserId;

    private Meet meet;

    private List<User> users;
    // 승인, 대기, 거절, 모임 완료
    private List<Status> statuses;

    // 유저가 생성, 참여, 신처
    private List<MeetType> meetTypes;

    @Builder
    public MeetUserDto(Long meetUserId, Meet meet) {
        this.meetUserId = meetUserId;
        this.meet = meet;
        this.users = new ArrayList<>();
        this.statuses = new ArrayList<>();
        this.meetTypes = new ArrayList<>();
    }

}
