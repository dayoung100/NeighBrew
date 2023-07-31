package com.ssafy.backend.entity;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.dto.PushDto;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Where(clause = "deleted = false")
public class Push{
    //알림 : "누구 : ~에 대한 알림이 도착했습니다.", 클릭하면 해당 페이지로 이동하도록.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "push_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PushType pushType;

    @Lob
    private String content;

    @Lob
    private String url;

    @Column(name="push_read_YN", nullable = false)
    private boolean isRead = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder
    public Push(User user, PushType pushType, String content, String url, boolean isRead){
        this.user = user;
        this.pushType = pushType;
        this.content = content;
        this.url = url;
        this.isRead =isRead;
        this.createdAt = LocalDateTime.now();
    }

    public Push() {
    }

    public PushDto toDto(){
        return PushDto.builder()
                .userId(this.user.getUserId())
                .userName(this.user.getName())
                .pushType(this.pushType)
                .content(this.content)
                .url(this.url)
                .isRead(this.isRead)
                .build();
    }
}