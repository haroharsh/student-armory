package com.armory.backend.exception;

import org.springframework.http.HttpStatus;

public class ImageConversionException extends RuntimeException {
    private final HttpStatus status;

    public ImageConversionException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public ImageConversionException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
