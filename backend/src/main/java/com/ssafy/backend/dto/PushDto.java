package com.ssafy.backend.dto;

import com.ssafy.backend.entity.Push;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

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
    public PushDto(Push push){
        this.id = push.getId();
        this.content = push.getContent();
        this.url = push.getRelatedURL();
        this.isRead = push.isRead();

        //yyyy-MM-dd HH:mm:ss 형태로 바꿔서 저장하기
        Date curDate = new Date();
        SimpleDateFormat form = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        this.createdAt = form.format(push.getCreatedAt());
    }
}
