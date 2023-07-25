package com.ssafy.backend.dto;

import com.ssafy.backend.Enum.Status;
import com.ssafy.backend.entity.Meet;
import com.ssafy.backend.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MeetUserDto {

    private Long meetUserId;

    private Meet meet;

    private List<User> users;

    // 유저가 생성, 참여, 신처
    private List<Status> statuses;

    @Builder
    public MeetUserDto(Long meetUserId, Meet meet) {
        this.meetUserId = meetUserId;
        this.meet = meet;
        this.users = new ArrayList<>();
        this.statuses = new ArrayList<>();
    }

}
