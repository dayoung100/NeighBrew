package com.ssafy.backend.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "deleted = false")
public class Drink {
    @Id
    @GeneratedValue
    private Long drinkId;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT default 'no image'")
    private String image;

    @Column(nullable = false, columnDefinition = "decimal(3, 2) default 0.0")
    private Float degree;

    @Lob
    private String description;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.image = this.image == null ? "no image" : this.image;
        this.degree = this.degree == null ? 0.0f : this.degree;
    }

    private boolean deleted = false;

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }


    @Builder
    public Drink(String name, String image, Float degree, String description) {
        this.name = name;
        this.image = image;
        this.degree = degree;
        this.description = description;
    }

    public Drink update(String name, String image, float degree, String description) {
        this.name = name;
        this.image = image;
        this.degree = degree;
        this.description = description;
        return this;
    }
}