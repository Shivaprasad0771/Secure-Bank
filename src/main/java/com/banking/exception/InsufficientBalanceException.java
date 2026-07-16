package com.banking.exception;

import org.springframework.http.HttpStatus;

public class InsufficientBalanceException extends BankingException {
    public InsufficientBalanceException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
