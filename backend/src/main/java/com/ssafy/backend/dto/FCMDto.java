package com.ssafy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class FCMDto {
    @Builder
    @AllArgsConstructor
    @Getter
    public static class Message{
        private String token;
        private Notification notification;
        private Data data;
    }

    @Builder
    @AllArgsConstructor
    @Getter
    public static class Notification { //알림 상단부에 들어가는 제목,
        private String  title; //프로젝트 명
        private String  body;  //알림 내용
    }

    @Builder
    @AllArgsConstructor
    @Getter
    public static class Data{
        private String  url; //이동할 Url을 정의한다.
    }

}
