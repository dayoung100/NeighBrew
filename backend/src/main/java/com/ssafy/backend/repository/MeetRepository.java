package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Meet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetRepository extends JpaRepository<Meet, Long> {

}
