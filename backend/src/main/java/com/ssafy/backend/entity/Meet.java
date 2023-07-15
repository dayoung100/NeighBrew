package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
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

    @ManyToOne
    @JoinColumn(name = "tagId")
    private Tag tag;
}
