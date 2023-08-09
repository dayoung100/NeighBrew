package com.ssafy.backend.repository;

import com.ssafy.backend.entity.Gugun;
import com.ssafy.backend.entity.GugunPK;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GugunRepository extends JpaRepository<Gugun, GugunPK> {
    List<Gugun> findBySidoCode(Integer sidoCode);
}
