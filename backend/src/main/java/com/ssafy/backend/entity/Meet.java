package com.ssafy.backend.entity;

import com.ssafy.backend.dto.MeetDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Meet {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @GeneratedValue
    private Long meetId;

    @Column(nullable = false, length = 100)
    private String meetName;

    @Lob
    private String description;

    @Column(nullable = false)
    private Long hostId;

    //최대 8명
    @Column(nullable = false, columnDefinition = "int default 1")
    private Integer participants = 1;

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


    //@Temporal(TemporalType.TIMESTAMP)
    //private Date createdAt;
    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    //    @Temporal(TemporalType.TIMESTAMP)
//    private LocalDateTime updatedAt;
    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;

    public Meet() {

    }

    @Builder
    public Meet(String meetName, String description, Long hostId, Integer participants, LocalDateTime meetDate, Tag tag, String sido, String gugun, String dong, Integer minAge, Integer maxAge, Float minLiverPoint) {
        this.meetName = meetName;
        this.description = description;
        this.hostId = hostId;
        this.participants = participants;
        this.meetDate = meetDate;
        this.tag = tag;
        this.sido = sido;
        this.gugun = gugun;
        this.dong = dong;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.minLiverPoint = minLiverPoint;
    }

//    @PrePersist
//    public void prePersist() {
//        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
//        if (this.updatedAt == null) this.updatedAt = LocalDateTime.now();
//    }

    public void update(Meet meet) {
        this.meetName = meet.getMeetName();
        this.description = meet.getDescription();
        this.participants = meet.getParticipants();
        this.hostId = meet.getHostId();
        this.meetDate = meet.getMeetDate();
        this.tag = meet.getTag();
        this.sido = meet.getSido();
        this.gugun = meet.getGugun();
        this.dong = meet.getDong();
        this.minAge = meet.getMinAge();
        this.maxAge = meet.getMaxAge();
        this.minLiverPoint = meet.getMinLiverPoint();
        this.updatedAt = LocalDateTime.now();
    }
    public MeetDto toDto(){
        return MeetDto.builder()
                .meetId(this.meetId)
                .meetName(this.meetName)
                .description(this.description)
                .hostId(this.hostId)
                .meetDate(this.meetDate)
                .tag(this.tag)
                .sido(this.sido)
                .gugun(this.gugun)
                .dong(this.dong)
                .minAge(this.minAge)
                .maxAge(this.maxAge)
                .minLiverPoint(this.minLiverPoint)
                .build();
    }

    @Override
    public String toString() {
        return "Meet{" +
                "meetId=" + meetId +
                ", meetName='" + meetName + '\'' +
                ", description='" + description + '\'' +
                ", hostId=" + hostId +
                ", participants=" + participants +
                ", meetDate=" + meetDate +
                ", tag=" + tag +
                ", sido='" + sido + '\'' +
                ", gugun='" + gugun + '\'' +
                ", dong='" + dong + '\'' +
                ", minAge=" + minAge +
                ", maxAge=" + maxAge +
                ", minLiverPoint=" + minLiverPoint +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
