package com.ssafy.backend.repository;

import com.ssafy.backend.entity.S3File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface S3Repository extends JpaRepository<S3File, Long> {
    void deleteByUploadFilePathAndUploadFileName(String uploadFilePath, String uploadFileName);

    void deleteByUploadFileUrl(String imgSrc);
}
