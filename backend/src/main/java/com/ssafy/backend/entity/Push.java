package com.ssafy.backend.entity;

import lombok.*;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "deleted = false")
public class Push{
    //알림 : "누구 : ~에 대한 알림이 도착했습니다.", 클릭하면 해당 페이지로 이동하도록.
    @Id
    @GeneratedValue
    private Long id;

    @Lob
    private String content;

    @Lob
    private String url;

    @Column(name="push_read_YN", nullable = false)
    private boolean isRead = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PushType pushType;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    @CreatedDate
    private Date createdAt;

    private boolean deleted = false;

    @Builder
    public Push(User user, PushType pushType, String content, String url, boolean isRead){
        this.user = user;
        this.pushType = pushType;
        this.content = content;
        this.url = url;
        this.isRead =isRead;
    }

}