package com.ssafy.backend.dto;

import com.ssafy.backend.Enum.PushType;
import com.ssafy.backend.entity.User;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.stereotype.Service;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;


@Getter
@Setter
@ToString
public class PushDto {
    private Long pushId;
    private String userName;
    private PushType pushType;
    private String content;
    private String url;
    private boolean isRead;
    private Long receiver_id;
    private Long sender_id;
    private LocalDateTime createdAt;

    public PushDto() {
    }

    @Builder
    public PushDto(Long pushId, String userName, PushType pushType, String content, String url, boolean isRead, Long receiver_id, Long sender_id, LocalDateTime createdAt) {
        this.pushId = pushId;
        this.userName = userName;
        this.pushType = pushType;
        this.content = content;
        this.url = url;
        this.isRead = isRead;
        this.receiver_id = receiver_id;
        this.sender_id = sender_id;
        this.createdAt = createdAt;
    }
}
