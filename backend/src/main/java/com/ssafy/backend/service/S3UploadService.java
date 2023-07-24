package com.ssafy.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.SecondaryTable;
import java.io.IOException;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class S3UploadService {
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private final AmazonS3 amazonS3;

    public String upload(MultipartFile multipartFile) throws IOException{
        //UUID에 랜덤 파일 명과 실제 파일명을 연결한다.
        String s3FileName = UUID.randomUUID() + "-" + multipartFile.getOriginalFilename();
//
//        파일 사이즈를 S3에 알려주기 위한 metaData 객체 선언
//        아래 방법을 수행하니 이미지를 바로 다운받게 된다.
        ObjectMetadata objMeta = new ObjectMetadata();
        objMeta.setContentLength(multipartFile.getInputStream().available());

//        //새창에서 띄우는 방법
//        PutObjectRequest objMeta = PutObjectRequest.
//
//        //S3 API 메소드인 PutObject 파일을 이용해 파일 Stream 생성 -> 업로드
//        amazonS3.putObject(bucket, s3FileName, multipartFile.getInputStream(), objMeta);

        //업로드된url을 가져옴
        return amazonS3.getUrl(bucket, s3FileName).toString();
    }


}
