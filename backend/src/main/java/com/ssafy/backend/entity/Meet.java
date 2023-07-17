package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@Where(clause = "deleted = false")
public class Meet {
    @Id
    @GeneratedValue
    private Long meetId;

    @Column(nullable = false, length = 100)
    private String name;

    //최대 8명
    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer number;

    @Lob
    private String description;

    @Temporal(TemporalType.DATE)
    private Date meetDate;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "tagId")
    private Tag tag;

    private boolean deleted = false;
}
