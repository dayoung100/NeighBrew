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
public class Push {

    @Id
    @GeneratedValue
    private Long pushId;

    @Lob
    private String content;

    @CreatedDate
    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    private boolean deleted = false;
}