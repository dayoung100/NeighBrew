package com.ssafy.backend.service;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.backend.Enum.UploadType;
import com.ssafy.backend.entity.S3File;
import com.ssafy.backend.repository.S3Repository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class S3Service {
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private final AmazonS3Client amazonS3Client;
    private final S3Repository s3Repository;

    public String upload(UploadType uploadType, MultipartFile multipartFile) throws IOException {
        //업로드할 경로를 Enum 값을 따라간다.
        String originFileName = multipartFile.getOriginalFilename();
        String uploadFileName = getUUIDFileName(originFileName);

        //파일 사이즈를 S3에 알려주기 위한 metaData 객체 선언
        ObjectMetadata objMeta = new ObjectMetadata();
        objMeta.setContentLength(multipartFile.getSize());
        objMeta.setContentType(multipartFile.getContentType());

        String upload = uploadType.name() + "/" + uploadFileName;
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

        String uploadFileUrl = amazonS3Client.getUrl(bucket, upload).toString();

        S3File s3File = S3File.builder()
                .originalFileName(originFileName)
                .uploadFileName(uploadFileName)
                .uploadFilePath(uploadType.name())
                .uploadFileUrl(uploadFileUrl)
                .build();

        //S3에 업로드 한 후 삭제 연산 수행
        s3Repository.save(s3File);

        //업로드된url을 가져옴
        return amazonS3Client.getUrl(bucket, upload).toString();
    }
    @Transactional
    public void deleteImg(String imgSrc){
        try {
            //S3에서 제거
            //실제 파일이 존재하는지 체크
            String[] urlParse = imgSrc.split("/");
            String deleteFile = urlParse[3] + "/" + urlParse[4];
            boolean isObjectExist = amazonS3Client.doesObjectExist(bucket, deleteFile);
            log.info("{}가 존재하나요? : {}", deleteFile, isObjectExist);
            if (isObjectExist) {
                amazonS3Client.deleteObject(bucket, deleteFile);
                //DB에서 제거
                s3Repository.deleteByUploadFileUrl(imgSrc);
            }

        } catch (Exception e) {
            log.debug("Delete File failed", e);
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
