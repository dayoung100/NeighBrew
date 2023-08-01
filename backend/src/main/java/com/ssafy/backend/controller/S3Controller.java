package com.ssafy.backend.controller;

import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/img")
public class S3Controller {
    private final S3Service s3UploadService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestPart("image") MultipartFile multipartFile) throws IOException {
        return ResponseEntity.ok(s3UploadService.upload(UploadType.USERPROFILE, multipartFile));
    }
}


/*
참고 링크
https://devlog-wjdrbs96.tistory.com/323
https://jforj.tistory.com/261
https://charlie-choi.tistory.com/236
https://chb2005.tistory.com/200
*/