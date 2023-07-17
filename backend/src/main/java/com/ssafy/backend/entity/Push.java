package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@Where(clause = "deleted = false")
public class Push{

    @Id
    @GeneratedValue
    private Long pushId;

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

    private boolean readYN = false;


    private boolean deleted = false;
}