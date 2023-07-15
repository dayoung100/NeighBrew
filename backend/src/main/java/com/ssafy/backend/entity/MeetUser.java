package com.ssafy.backend.entity;

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
}

enum Status {
    ACCEPTED, WAITING, REJECTED, FINISHED
}
