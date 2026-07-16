package com.banking.dto.transaction;

import com.banking.entity.Transaction;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private String transactionReference;
    private Transaction.TransactionType transactionType;
    private BigDecimal amount;
    private String senderAccountNumber;
    private String senderName;
    private String receiverAccountNumber;
    private String receiverName;
    private String description;
    private Transaction.TransactionStatus status;
    private LocalDateTime createdAt;
}
