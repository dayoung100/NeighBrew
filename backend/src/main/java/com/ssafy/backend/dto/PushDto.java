package com.ssafy.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.Date;


@Data
public class PushDto {
    private Long id;
    private String content;
    private String url;
    private Boolean isRead;
    private String createdAt;

    @Builder
    public PushDto(){
        this.id = getId();
        this.content = getContent();
        this.url = getUrl();
        this.isRead = getIsRead();
        this.createdAt = getCreatedAt();
    }
}
