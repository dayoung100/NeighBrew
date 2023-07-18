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

    @Id
    @GeneratedValue
    private Long id;

    @Lob
    private String content;

    @Lob
    private String relatedURL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PushType pushType;

    @CreatedDate
    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    @Column(name="push_read_YN")
    private boolean isRead = false;

    private boolean deleted = false;

    @Builder
    public Push(User receiver, PushType pushType, String content, String url, boolean isRead){
        this.user = receiver;
        this.pushType = pushType;
        this.content = content;
        this.relatedURL = url;
        this.isRead =isRead;
    }
}