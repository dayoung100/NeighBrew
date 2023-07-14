package com.ssafy.backend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
@Getter
@Setter
public class ChatRoom {
    @Id
    @GeneratedValue
    private Long chatRoomId;

    private String name;
}
