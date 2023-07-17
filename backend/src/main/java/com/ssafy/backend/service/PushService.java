package com.ssafy.backend.service;

import com.ssafy.backend.repository.PushRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class PushService {
    //타임아웃 설정 - 30분으로 연결 설정한다.
    private static final Long DEFAULT_TIMEOUT = 60L  * 1000 * 30;
    private final PushRepository pushRepository;

    @Autowired
    public PushService(PushRepository pushRepository) {
        this.pushRepository = pushRepository;
    }

    public HttpStatus subscribe(Long id) {
        return null;
    }

    public void notify(Long id, String data) {
    }
}
