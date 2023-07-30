package com.ssafy.backend.dto;

import com.ssafy.backend.Enum.PushType;
import lombok.Builder;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;


@Data
public class PushDto {
    private Long id;
    private PushType pushType;
    private String content;
    private String url;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public PushDto() {
    }

    @Builder
    public PushDto(Long id, PushType pushType, String content, String url, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.pushType = pushType;
        this.content = content;
        this.url = url;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }
}
