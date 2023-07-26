package com.ssafy.backend.service;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.backend.Enum.UploadType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class S3Service {
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Autowired
    private final AmazonS3Client amazonS3Client;

    public String upload(UploadType uploadType, MultipartFile multipartFile) throws IOException {
        //업로드할 경로를 Enum 값을 따라간다.
        String originFileName = multipartFile.getOriginalFilename();
        String uploadFullName = getUUIDFileName(originFileName);

//      파일 사이즈를 S3에 알려주기 위한 metaData 객체 선언
//      아래 방법을 수행하니 이미지를 바로 다운받게 된다.
        ObjectMetadata objMeta = new ObjectMetadata();
        objMeta.setContentLength(multipartFile.getSize());
        objMeta.setContentType(multipartFile.getContentType());

        String upload = uploadType.name() + "/" + uploadFullName;
        try (InputStream inputStream = multipartFile.getInputStream()) {
            //S3에 폴더와 파일 업로드 수행
            amazonS3Client.putObject(
                    new PutObjectRequest(bucket, upload, inputStream, objMeta));

            // TODO : 외부에 공개하는 파일인 경우 Public Read 권한을 추가, ACL 확인
        /*amazonS3Client.putObject(
            new PutObjectRequest(bucket, s3Key, inputStream, objectMetadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));*/
        } catch (IOException e) {
            e.printStackTrace();
            log.error("file Upload fail", e);
        }

        String uploadFileUrl

        //업로드된url을 가져옴
        return amazonS3Client.getUrl(bucket, upload).toString();
    }

    public void deleteImg(UploadType uploadType, String fileName) throws IOException {
        String reuslt;
        try {
            String directory = uploadType.name() + "/";
        } catch (SdkClientException e) {
            throw new IOException("Error : delete '" + fileName + "' file from S3", e);
        }
    }

    public String getUUIDFileName(String fileName) {
        String ext = fileName.substring(fileName.indexOf(".") + 1);
        return UUID.randomUUID().toString() + "." + ext;
    }


}
/*
 * TODO : 테이블 매핑 안되는 경우 지우는 S3 기능이 존재
 *  */
