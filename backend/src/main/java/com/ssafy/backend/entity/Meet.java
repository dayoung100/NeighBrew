package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
public class Meet {
    @Id
    @GeneratedValue
    private Long meetId;

    @Column(nullable = false, length = 100)
    private String meetName;

    @Lob
    private String description;

    @Column(nullable = false)
    private Long hostId;

    //최대 8명
    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer participants;

    //모임날짜
    private LocalDateTime meetDate;

    @ManyToOne
    @JoinColumn(name = "tagId")
    private Tag tag;


    @Column(nullable = false)
    private String sido;
    @Column(nullable = false)
    private String gugun;
    @Column(nullable = false)
    private String dong;

    private Integer minAge;
    private Integer maxAge;
    private Float minLiverPoint;


    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}
