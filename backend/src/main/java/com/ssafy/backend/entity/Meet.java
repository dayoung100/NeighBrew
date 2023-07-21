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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long meetId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, name = "master")
    private Long masterId;

    //최대 8명
    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer number;

    @Lob
    private String description;

    @Temporal(TemporalType.DATE)
    private Date meetDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "meet_reg_dt")
    private Date createdAt;

    @Temporal(TemporalType.DATE)
    @Column(name = "meet_update_dt")
    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "tagId")
    private Tag tag;



}
