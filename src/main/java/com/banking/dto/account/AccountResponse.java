package com.banking.dto.account;

import com.banking.entity.Account;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    private Long id;
    private String accountNumber;
    private Account.AccountType accountType;
    private BigDecimal balance;
    private Account.AccountStatus status;
    private String ownerName;
    private String ownerEmail;
    private LocalDateTime createdAt;
}
