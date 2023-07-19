package com.ssafy.backend.authentication.infra;

public class InvalidTokenException extends RuntimeException  {
    public InvalidTokenException(String message) {
        super(message);
    }
}
