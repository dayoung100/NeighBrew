package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table
@Getter
@Setter
public class Meet {
    @Id
    @GeneratedValue
    private Long meetId;

    private String name;

    private Integer number;

    @Lob
    private String description;

    @Temporal(TemporalType.DATE)
    private Date meetDate;

    @ManyToOne
    @JoinColumn(name = "tagId")
    private Tag tag;
}
