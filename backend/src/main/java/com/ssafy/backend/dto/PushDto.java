package com.ssafy.backend.dto;

import com.ssafy.backend.Enum.PushType;
import lombok.*;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;


@Getter
@Setter
@ToString
public class PushDto {
    private Long userId;
    private String userName;
    private PushType pushType;
    private String content;
    private String url;
    private Boolean isRead;

    public PushDto() {
    }

    @Builder

    public PushDto(Long userId, String userName, PushType pushType, String content, String url, Boolean isRead) {
        this.userId = userId;
        this.userName = userName;
        this.pushType = pushType;
        this.content = content;
        this.url = url;
        this.isRead = isRead;
    }
}
