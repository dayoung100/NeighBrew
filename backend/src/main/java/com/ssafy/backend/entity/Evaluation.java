package com.ssafy.backend.entity;

import com.ssafy.backend.Enum.EvaluationType;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long evaluationId;

    @ManyToOne
    @JoinColumn(name = "rated_user_id", referencedColumnName = "userId") // 수정된 부분
    private User ratedUser;

    @ManyToOne
    @JoinColumn(name = "reviewer_id", referencedColumnName = "userId") // 수정된 부분
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "meetId")
    private Meet meetId;


    @Enumerated(EnumType.STRING)
    private EvaluationType evaluationType;

    @Lob
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date createdAt;


    @PrePersist
    public void createdAt() {
        this.createdAt = new Date();
    }
}
